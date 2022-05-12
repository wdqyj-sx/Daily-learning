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
                 
            }
        }catch(e){
            reject(e)
        }
    }else {
        reject(x)
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
        let promise2 = new Promise((resolve,reject)=>{
            if(this.status === FULFILLED){
                setTimeout(()=>{
                    try{
                        let x = onFulfulled(this.value)
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
                        }catch(e){
                            reject(e)
                        }
                    }); 
                })
                this.onRejectedCallback.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x = onRejected(this.reason)
                        }catch(e){
                            reject(e)
                        }
                    })
                })
            }
        })
       
    }
}

module.exports = Promise