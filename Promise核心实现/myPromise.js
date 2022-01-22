// 声明Promise类，传入一个执行器函数，函数会立即执行
// Promise类里面有三个状态，pending,fulfill,reject,默认Pending,
// 执行器函数会传入两个回调，分别用改将状态改变为fulfill和reject
// 类里面两个属性用来保存状态改变时，接受到的数据

const { fail } = require("assert");
const { reject } = require("lodash");

// 类里面的then函数传入两个回调，分别根据状态来执行相应的操作
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

class myPromise {
    // 执行器为用户自定义，可能会出错
    constructor(executor) {
        //自执行
        try {
            executor(this.resolve, this.reject)

        }
        catch (e) {
            this.reject(e)
        }
    }
    status = PENDING;
    value = undefined;
    reason = undefined;
    successCallback = [];
    failCallback = []
    resolve = value => {
        if (this.status !== PENDING)
            return;
        this.value = value;
        this.status = FULFILLED;
        //判断成功回调的栈里是否有等待的执行
        while (this.successCallback.length)
            this.successCallback.shift()()
    }
    reject = reason => {
        if (this.status !== PENDING)
            return;
        this.reason = reason;
        this.status = REJECTED;
        while (this.failCallback.length)
            this.failCallback.shift()()
    }
    then (successCallback, failCallback) {
        // then可以实现链式调用，因此then函数必定返回一个promise对象
        let p = new myPromise((resolve, reject) => {
            //构造器为自执行，因此可以将then里面的操作放入新的构造器里
            //要拿到successCallback和failCall的执行结果，放入里面的promise中，以便下一个Promise通过then调用
            // 而拿到回调的执行结果需要考虑三件事
            // 1 结果如果是一个Promise类型，就需要查看其返回的结果
            // 2 回调是用户自己设置的，需要try一下，保证不出错
            // 3 如果结果是声明的Promise本身，则应该报错

            // then 的参数可以不写，不写的话其对象内保存的值会传递到下一个Promise中
            successCallback = successCallback ? successCallback : value => value;
            failCallback = failCallback ? failCallback : reason => { throw reason }
            if (this.status === FULFILLED) {
                // 解决办法
                // 1 创建一个函数，用来判断结果是否是Promise对象，及是否为原对象本身
                // 2.设置settimeout,以便拿到原对象（否则在原对象的声明里拿不到 p）
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value)
                        resolvePromise(p, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            }
            else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason)
                        resolvePromise(p, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            }
            //如果状态为PENDING，说明执行的为异步操作，需要等待状态改变之后再执行
            else {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value)
                            resolvePromise(p, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason)
                            resolvePromise(p, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                })
            }
        })
        return p

    }
    
    //静态方法 all的实现
    static all(arr){
        let index =0;
        let result = []
        // console.log(arr)
        return new myPromise((resolve,reject)=>{
            function addData(key,value){
                result[key] = value
                index++;
                if(index === arr.length){
                   resolve(result)
                }
            }
            for(let i =0;i<arr.length;++i){
                let current = arr[i]
                if(current instanceof myPromise){
                    current.then(value =>addData(i,value),reason => reject(reason) )
                }else {
                    addData(i,current)
                }
            }
            
        })
      
    }
    // resolve的实现
    static resolve(value){
        return new myPromise((resolve,reject)=>{
            resolve(value)
        })
    }
    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
    // catch实现
     catch(errFn){
       return this.then(null,errFn)
    }
    // finally方法实现
    // 传入一个回调并执行，返回一个promise并且可以执行原来promise的值
    finally(callback){
        //返回一个promise
        return this.then(value => {
            //执行回调，并把原来promise值传入新的promise
          return  myPromise.resolve(callback()).then(()=>value)
        },reason=>{
            return myPromise.resolve(callback()).then(()=>{
                throw reason
            })
        })
    }
}

function resolvePromise (p, x, resolve, reject) {

    if (p === x) {
        return reject(new Error('Chaining cycle detected for promise #<Promise>'))
    }
    // 判断x是否为myPromise对象
    if (x instanceof myPromise) {

        x.then(resolve, reject)
    }
    else {
        //普通值
        resolve(x)
    }
}

module.exports = myPromise