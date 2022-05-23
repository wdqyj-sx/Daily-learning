const path = require('path')
const fs = require('fs')
const vm = require('vm')

function Module(id){
    this.id = id
    this.exports = {}
}

Module._resolveFilename = function(id){
    const filePath = path.resolve(__dirname,id)
    //如果有后缀
   if(fs.existsSync(filePath)){
       return filePath
   }
   //如果无后缀
   const exts =  Object.keys(Module._extension);
   for(let i = 0;i<exts.length;++i){
       let file = filePath+exts[i]
       if(fs.existsSync(file)){
           return file
       }
   }
   throw Error('Cannot find module:' + id)
}

Module._extension = {
    '.js'(module){
        //读取模块内容
        const content = fs.readFileSync(module.id,'utf8')
        //获取包裹函数
        let wrapperFn = vm.compileFunction(content,['exports','require','module','__filename','__dirname'])
        let exports = this.exports
        let thisValue = exports
        let require = myRequire
        let filename = module.id
        let dirname = path.dirname(filename)
        Reflect.apply(wrapperFn,thisValue,[exports, require, module, filename, dirname])
    },
    '.json'(module){
        //若内容是json，则直接赋值
        const content = fs.readFileSync(module.id,'utf8')
        module.exports = JSON.parse(content)
    }
}

Module.prototype.load = function(filename){
    let ext = path.extname(filename)
    Module._extension[ext](this)
}

function myRequire(id){
    //获取完整路径
   let absPath = Module._resolveFilename(id)
   const module = new Module(absPath)
   module.load(absPath)
   return module.exports
}

let str = myRequire('./text')
console.log(str)  //hello world

