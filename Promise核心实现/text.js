const myPromise = require("./myPromise")

myPromise.all([1,2,new myPromise((resolve,reject)=>{
   resolve('sxx')
}),'hj'])
.then(value=>{
    console.log(value)
},reason=>{
    console.log(reason)
})
   
