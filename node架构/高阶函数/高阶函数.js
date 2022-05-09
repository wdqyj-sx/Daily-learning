// function core (a,b,c){
//     console.log(a,b,c)
// }

// Function.prototype.before = function(cb){
//     return (...args)=>{
//         cb()
//         this(...args)
//     }
// }
// let newCore = core.before(()=>{console.log('before')})
// newCore(1,2,3)

// function Currying(fn){
//    //获取函数长度
//     let len = fn.length
//    //获取剩余参数
//    let allArg = Array.from(arguments).splice(1)
//    return (...newArg)=>{
//        allArg = [...allArg,...newArg]
//        if(allArg.length >= len){
//            return fn(...allArg)
//        }else {
//            return Currying(fn,...allArg)
//        }
//    }
// }

// function sum(a,b,c,d){
//     return a+b+c+d
// }

// let newSum = Currying(sum,1,2)
// console.log(newSum(3)(4))

// function unCurrying(fn){
//     return (...args)=>{
//         return (Function.prototype.call).call(fn,...args)
//     }
// }

// let toString = unCurrying(Object.prototype.toString)
// console.log(toString(123))
// console.log(toString('123'))
// const fs = require("fs")
// const path = require("path")
// fs.readFile(path.resolve(__dirname,'./file/1.txt'),'utf-8',function(err,data){
//     finish('1',data)
// })

// fs.readFile(path.resolve(__dirname,'./file/2.txt'),'utf-8',function(err,data){
//     finish('2',2)
    
// })

// function after(timer,cb){
//     let util={}
//     return function(key,value){
//         util[key] = value
//         if(--timer === 0){
//             cb(util)
//         }
//     }
// }
// const finish = after(2,function(obj){
//     console.log(obj)
// })

// const fs = require('fs')
// const path = require('path')
// // const { emit } = require('process')

// const events = {
//     _arr:[],
//     on(callback){
//         this._arr.push(callback)
//     },
//     emit(key,value){
//         this._arr.forEach(fn=>{
//             fn(key,value)
//         })
//     }
// }

// let obj = {}
// //订阅
// events.on((key,value)=>{
//     obj[key] = value
//     if(Object.keys(obj).length == 2){
//         console.log(obj)
//     }
// })
// fs.readFile(path.resolve(__dirname,'./file/1.txt'),'utf-8',function(err,data){
//     //发布
//     events.emit(1,data)
// })

// fs.readFile(path.resolve(__dirname,'./file/2.txt'),'utf-8',function(err,data){
//     events.emit(2,data)
    
    
// })

class Subject{
    constructor(name){
        this.name = name,
        this.state = '开心',
        this.observer = []
    }
    attach(ob){
        this.observer.push(ob)
    }
    setState(newState){
        if(this.state != newState){
            this.state = newState
            this.observer.forEach(ob=>{
                ob.update(this.state)
            })
        }
    }
}

class Observer{
    constructor(name){
        this.name = name
    }
    update(state){
        console.log(state)
    }
}

let baby = new Subject('baby')
let mon = new Observer('mon')
let fath = new Observer('fath')
baby.attach(mon)
baby.attach(fath)
baby.setState('哭')