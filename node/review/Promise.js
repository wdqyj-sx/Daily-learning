const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"

function resolvePromise (p, x, resolve, reject) {
    //若为其本身
    if (x === p) {
        //抛出错误
        reject(new Error('错误'))
    }
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        // 如果x是用户定义的Promise,为防止其规范，加上一个防护措施，防止状态二次改变
        let called = false
        // try一下，x即使有then方法也不一定能调用,defineProperty定义可以设置限制
        try {
            let then = x.then;
            //可以认为是Promise
            if (typeof then === 'function') {
                // 执行then，采用call执行，不宜直接调用,
                then.call(x, (value) => {
                    if (called) {
                        return;
                    }
                    called = true
                    //递归
                    resolvePromise(p, value, resolve, reject)
                }, (reason) => {
                    if (called) {
                        return
                    }
                    called = true
                    reject(reason)
                })
            } else {
                if (called)
                    return
                called = true
                resolve(x)
            }
        }
        catch (e) {
            reject(e)
        }
    }
    else {
        resolve(x)
    }
}

class Promise {
    constructor(executor) {
        this.state = PENDING
        this.value = undefined
        this.reason = undefined
        this.resolveCallback = []
        this.rejectCallback = []
        const resolve = (value) => {
            //只有当状态是PENDING时才能改变状态
            if (this.state === PENDING) {
                this.state = FULFILLED
                this.value = value
                this.resolveCallback.forEach(fn => fn())
            }
        }
        const reject = (reason) => {

            if (this.state === PENDING) {
                this.state = REJECTED
                this.reason = reason
                this.rejectCallback.forEach(fn => fn())
            }
        }
        //，默认执行构造器
        try {
            executor(resolve, reject);
        } catch (e) {
            //如果出错这直接变成错误状态
            reject(e)
        }
    }
    then (onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err }

        let p = new Promise((resolve, reject) => {
            if (this.state === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(p, x, resolve, reject)
                    }
                    catch (e) {
                        reject(e)
                    }
                }, 0);

            }
            if (this.state === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(p, x, resolve, reject)
                    }
                    catch (e) {
                        reject(e)
                    }
                }, 0);
            }
            if (this.state === PENDING) {
                this.resolveCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(p, x, resolve, reject)
                        }
                        catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
                this.rejectCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(p, x, resolve, reject)
                        }
                        catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
            }
        })
        return p

    }

    static resolve (value) {
        return new Promise((resolve, reject) => {
            resolve(value)
        })
    }
    static reject (reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }
    static catch (errfn) {
        return this.then(null, errfn)
    }
    static all (promises) {
        return new Promise((resolve, reject) => {
            let timer = 0;
            let result = []
            const processSuccess = function (index, data) {
                result[index] = data
                if (++timer === promises.length) {
                    resolve(result)
                }

            }
            for (let i = 0; i < promises.length; ++i) {
                let p = promises[i]
                //判断是否为promise
                if (p && typeof p.then === "function") {
                    p.then(value => {
                        processSuccess(i, value)
                    }, reject)
                }
                else {
                    processSuccess(i, p)
                }
            }
        })
    }
}

module.exports = Promise