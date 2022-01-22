const myPromise = require("./myPromise")

new myPromise((resolve,reject)=>{
    resolve('sx')
}).finally(()=>{
    setTimeout(() => {
        console.log('sxx')
    }, 1000);
}).then((value=>{
    console.log(value)
}),reason=>{
    console.log(reason)
})
   
