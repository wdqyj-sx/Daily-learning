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