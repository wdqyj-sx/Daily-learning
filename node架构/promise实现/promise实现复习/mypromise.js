const { reject } = require("lodash")
const { resolve } = require("path")

const PENDING = "PENDING"
const REJECTED = "REJECTED"
const FULFILLED = "FULFILLED"

function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError(`Chaining cycle detected for promise #<Promise> my`))
    }
    if ((typeof x === 'object' && x !== null) || (typeof x === 'function')) {
        let called = false
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, e => {
                    if (called) return
                    called = true
                    reject(e)
                })
            }
            else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

class Promise {
    constructor(exector) {
        this.status = PENDING
        this.value = null
        this.reason = null
        this.onResolveCallback = []
        this.onRejectedCallback = []
        const resolve = (value) => {
            if (value instanceof Promise) {
                return value.then(resolve, reject)
            }
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value
                this.onResolveCallback.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                this.onRejectedCallback.forEach(fn => fn())
            }
        }
        try {
            exector(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    then (onFulfulled, onRejected) {
        onFulfulled = typeof onFulfulled === 'function' ? onFulfulled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfulled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    }
                    catch (e) {
                        reject(e)
                    }
                })
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            if (this.status === PENDING) {
                this.onResolveCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfulled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    });
                })
                this.onRejectedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }
        })
        return promise2
    }
    catch (onRejected) {
        return this.then(null, onRejected)
    }
}

Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}
Promise.Resolve = (value) => {
    return new Promise((resolve, reject) => {
        resolve(value)
    })
}
Promise.Reject = (reason) => {
    return new Promise((resolve, reject) => {
        reject(reason)
    })
}
Promise.all = function (value) {
   
    return new Promise((resolve, reject) => {
        let result = []
        let times = []
        function processMap (index, data) {
            result[index] = data
            if (times++ == value.length) {
                resolve(result)
            }
        }
        for (let i = 0; i < value.length; ++i) {
            Promise.resolve(value[i]).then(data => {
                processMap(i, data)
            }, reject)
        }
    })

}

Promise.allSettled = function (value) {

    return new Promise((resolve, reject) => {
        let result = []
        let times = []
        function processMap (index, data) {
            result[index] = data
            if (times++ == value.length) {
                resolve(result)
            }
        }
        for (let i = 0; i < value.length; ++i) {
            Promise.resolve(value[i]).then(data => {
                processMap(i, { status: 'fulfilled', data })
            }).catch(reason => {
                processMap(i, { status: 'rejected', reason })
            })
        }
    })
}

Promise.race = function(value){
    return new Promise((resolve,reject)=>{
        value.forEach(item=>{
            Promise.resolve(item).then(resolve,reject)
        })
    })
}
Promise.prototype.finally = function (finall) {
    return this.then((value) => {
        return Promise.Resolve(finall()).then(() => value)
    }, (finall) => {
        return Promise.Reject(finall()).then(() => { throw reason })
    })
}
module.exports = Promise

function promisify(fn){
    return function(...args){
        return new Promise((resolve,reject)=>{
            fn(...args,function(err,data){
                if(err){
                    reject(err)
                }
                resolve(data)
            })
        })
    }
}

function promisifyAll(obj){
    for(let key in obj){
        if(typeof obj[key] == 'function'){
            obj[key] = promisify(obj[key])
        }
    }
}