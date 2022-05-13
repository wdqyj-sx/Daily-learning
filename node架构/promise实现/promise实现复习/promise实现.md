### promise的理解及实现
#### 基于回调的异步解决方案缺陷
> js通常采用四种异步解决方案：回调、promise、Generator、async/await
* 回调解决方案
> 通常异步的操作需要放入回调中进行执行，若要执行串行异步，则容易造成回调嵌套
* promise优势
    * 通过then来实现异步的执行，解决了回调嵌套问题（本质 依然是回调）
    * 解决异步并发问题(promise.all)
    * 使错误处理变得简单
#### promise实现
* 初步实现思路
  * 基本状态实现
  * 添加then
  * 显示异步操作
  ```js
  const PENDING =  "PENDING"
    const REJECTED = "REJECTED"
    const FULFILLED =  "FULFILLED"

    class Promise{
        constructor(exector){
            this.status = PENDING
            this.value = null
            this.reason = null
            this.onResolveCallback = []
            this.onRejectedCallback =  []
            const resolve = (value)=>{
                if(this.status===PENDING){
                    this.status = FULFILLED
                    this.value = value
                    this.onResolveCallback.forEach(fn=>fn())
                }
            }
            const reject =(reason) => {
                if(this.status === PENDING){
                    this.status = REJECTED
                    this.reason = reason
                    this.onRejectedCallback.forEach(fn=>fn())
                }
            }
            try{
                exector(resolve,reject)
            }catch(e){
                reject(e)
            }
        }

        then(onFulfulled,onRejected){
            if(this.status === FULFILLED){
                onFulfulled(this.value)
            }
            if(this.status === REJECTED){
                onRejected(this.reason)
            }
            if(this.status === PENDING){
                this.onResolveCallback.push(()=>{
                    onFulfulled(this.value)
                })
                this.onRejectedCallback.push(()=>{
                    onRejected(this.reason)
                })
            }
        }
    }

    module.exports = Promise
  ```
* 实现then的流程
  * then返回一个promise
  * then可以实现值的穿透
  ```js
  const PENDING =  "PENDING"
    const REJECTED = "REJECTED"
    const FULFILLED =  "FULFILLED"

    function resolvePromise(promise2,x,resolve,reject){
        if(promise2 === x){
            return reject(new TypeError(`Chaining cycle detected for promise #<Promise> my`))
        }
        if((typeof x === 'object' && x!==null) || (typeof x === 'function')){
            let called = false
            try{
                let then = x.then
                if(typeof then  === 'function'){
                    then.call(x,y=>{
                        if(called)return
                        called = true
                        resolvePromise(promise2,y,resolve,reject)
                    },e=>{
                        if(called)return
                        called = true
                        reject(e)
                    })
                }
                else {
                    resolve(x)
                }
            }catch(e){
                if(called)return
                called = true
                reject(e)
            }
        }else {
            resolve(x)
        }
    }

    class Promise{
        constructor(exector){
            this.status = PENDING
            this.value = null
            this.reason = null
            this.onResolveCallback = []
            this.onRejectedCallback =  []
            const resolve = (value)=>{
                if(value instanceof Promise){
                    return value.then(resolve,reject)
                }
                if(this.status===PENDING){
                    this.status = FULFILLED
                    this.value = value
                    this.onResolveCallback.forEach(fn=>fn())
                }
            }
            const reject =(reason) => {
                if(this.status === PENDING){
                    this.status = REJECTED
                    this.reason = reason
                    this.onRejectedCallback.forEach(fn=>fn())
                }
            }
            try{
                exector(resolve,reject)
            }catch(e){
                reject(e)
            }
        }

        then(onFulfulled,onRejected){
            onFulfulled = typeof onFulfulled === 'function'?onFulfulled:v=>v
            onRejected = typeof onRejected === 'function'? onRejected:r=>{throw r}
            let promise2 = new Promise((resolve,reject)=>{
                if(this.status === FULFILLED){
                    setTimeout(()=>{
                        try{
                            let x = onFulfulled(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        }
                        catch(e){
                            reject(e)
                        }
                    })
                }
                if(this.status === REJECTED){
                    setTimeout(() => {
                        try{
                        let x = onRejected(this.reason)   
                        resolvePromise(promise2,x,resolve,reject) 
                        }catch(e){
                            reject(e)
                        }
                    });
                }
                if(this.status === PENDING){
                    this.onResolveCallback.push(()=>{
                        setTimeout(() => {
                            try{
                                let x = onFulfulled(this.value)
                                resolvePromise(promise2,x,resolve,reject)
                            }catch(e){
                                reject(e)
                            }
                        }); 
                    })
                    this.onRejectedCallback.push(()=>{
                        setTimeout(()=>{
                            try{
                                let x = onRejected(this.reason)
                                resolvePromise(promise2,x,resolve,reject)
                            }catch(e){
                                reject(e)
                            }
                        })
                    })
                }
            })
        return promise2
        }
    }
  ```
* promise单元测试
  * 安装测试工具 `npm install promises-aplus-tests -g`
  * 开始测试: `promises-aplus-tests mypromise.js`
  ```js
    Promise.deferred = function(){
        let dfd = {}
        dfd.promise = new Promise((resolve,reject)=>{
            dfd.resolve = resolve
            dfd.reject = reject
        })
        return dfd
    }
  ```
* Promise相关方法
* 实例方法
* catch
  ```js
   catch(onRejected){
        return this.then(null,onRejected)
    }
  ```
  * 静态方法
  * Resolve
  ```js
    Promise.Resolve = (value)=>{
        return new Promise((resolve,reject)=>{
            resolve(value)
        })
    }
  ```
  * Reject
  ```js
        Promise.Reject = (reason)=>{
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
  ```
  * all
  ```js
    Promise.all=function(value){
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
  ```
  * allSettled
  ```js
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
  ```
  * race
  ```js
    Promise.race = function(value){
        return new Promise((resolve,reject)=>{
            value.forEach(item=>{
                Promise.resolve(item).then(resolve,reject)
            })
        })
    }
  ```
  *原型链方法
  ```js
    Promise.prototype.finally = function(finall){
        return this.then((value)=>{
            return Promise.Resolve(finall()).then(()=>value)
        }, (finall)=>{
            return Promise.Reject(finall()).then(()=>{throw reason})
        })
    }
  ```

* 将node函数转换成promise
  ```js
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
  ```
