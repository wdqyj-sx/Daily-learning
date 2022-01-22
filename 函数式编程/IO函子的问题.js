const fp = require("lodash/fp")
const fs =require("fs")
class IO{
    static of(x){
        return new IO(function(){
            return x
        })
    }

    constructor(fn){
        this._value = fn
    }

    map(fn){
        return new IO(fp.flowRight(fn,this._value))
    }
}

let readFile = function(filename){
    return new IO(function(){
        return fs.readFileSync(filename,'utf-8')
    })
}

let print = function(x){
    return new IO(function(){
        console.log('sx',x)
        return x
    })
}

let cat = fp.flowRight(print,readFile)

let r = cat('../README.md')
console.log(r._value())
// console.log(r._value()._value())

