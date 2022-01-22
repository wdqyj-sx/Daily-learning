const { task } = require("folktale/concurrency/task")
const fs = require("fs")
const fp = require("lodash/fp")

function readFile(filename){
    return task(resolver=>{
        fs.readFile(filename,'utf-8',(err,data)=>{
            if(err) resolver.reject(err)
            resolver.resolve(data)
        })
    })
}

readFile('../README.md')
    .map(fp.split('\n'))
    .map(fp.find(x=>x.includes('node')))
    .run()
    .listen({
        onRejected:err => {
            console.log(err)
        },
        onResolved:value=>{
            console.log(value)
        }
    })