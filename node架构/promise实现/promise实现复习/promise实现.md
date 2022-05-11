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
