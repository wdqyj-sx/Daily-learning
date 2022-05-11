// const Promise = require("./mypromise")

let p = new Promise((resolve,reject)=>{
   setTimeout(()=>{
    reject('sx')
    resolve('sxx')
   },1000)
})

p.then((value)=>{
    console.log(value)
},(reason)=>{
    console.log(reason)
})
