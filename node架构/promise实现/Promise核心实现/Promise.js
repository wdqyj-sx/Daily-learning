const fs = require("fs")

let promise = new Promise((resolve,reject)=>{
    //条件成功
   fs.readFile("../README.md",'utf-8',function(err,data){
       if(err){
           reject(err.message)
       }
       resolve(data)
   })
})

promise.then((value=>{
    console.log(promise)
},err=>{
    console.log(err)
}))