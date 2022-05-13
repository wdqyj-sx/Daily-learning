// const Promise = require("./mypromise")

let p = new Promise((resolve,reject)=>{
   setTimeout(()=>{
    // reject('sx')
    resolve('sxx')
   },1000)
})

p.then((value)=>{
   return new Promise((resolve,reject)=>{
       resolve(2)
   })
},(reason)=>{
    console.log(reason)
})
.then(v=>{
    // console.log(v)
})
