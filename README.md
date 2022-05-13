# Daily learning
 * 记录一下每日学习的笔记，投资自己
- [Daily learning](#daily-learning)
  - [博客地址](#博客地址)
  - [node](#node)
    - [高阶函数](#高阶函数)
      - [高阶函数类型](#高阶函数类型)
      - [高阶函数作用](#高阶函数作用)
      - [函数柯里化](#函数柯里化)
        - [如何判断数据类型](#如何判断数据类型)
        - [柯里化概念](#柯里化概念)
        - [异步并发问题](#异步并发问题)
    - [promise的理解及实现](#promise的理解及实现)
      - [基于回调的异步解决方案缺陷](#基于回调的异步解决方案缺陷)
      - [promise实现](#promise实现)
## [博客地址](https://blog.csdn.net/wenyeqv?type=blog)
## node
  * 记录node的学习历程
### 高阶函数
#### 高阶函数类型
* 一个函数返回一个函数
* 一个函数的参数是高阶函数
#### 高阶函数作用
* 高阶函数可以对一个函数进行扩展，使之在执行阶段能有其它业务处理
    * 形式1
    ```js
     function fn(){
         return function(){}
     }
    ```
    * 形式2
    ```js
    function(cb){
        cb()
    }
    ```
    * 例如扩展一个函数，在其执行之前，进行其它操作
    ```js
    function core (a,b,c){
    console.log(a,b,c)
    }

    Function.prototype.before = function(cb){
        return (...args)=>{
            cb()
            this(...args)
        }
    }
    let newCore = core.before(()=>{console.log('before')})
    newCore(1,2,3)
    ```
    * 总结：通过传入函数来扩展新的操作，通过返回一个新的函数来将新操作和原函数结合
#### 函数柯里化
##### 如何判断数据类型
* typeof
  * typeof 只能判断基本数据类型，其中typeof null = 'object'
  * typeof undefine = 'undefine'
  * typeof Object   typeof Function typeof Array 皆为"function"
  * typeof function fn(){} 为"function"
  * typeof []  typeof {} 为"object"
* instanceof
  * 检测构造函数的prototype属性是否出现在实例对象的原型链上
  ```js
  function person(){	
    }
    let p = new person()
    console.log(p instanceof person)
  ```
* constructor 拷贝   除了null和undefined以外，其它类型都是包装类对象
  ```js
    let num = 1
    console.log(num.constructor)
    let arr = []
    console.log(arr.constructor)
    let a = ()=>{}
    console.log(a.constructor)
    <!-- [Function: Number] -->
    <!-- [Function: Array] -->
    <!-- [Function: Function] -->
  ```
* Object.prototype.toString.call()
  ```js
    console.log(Object.prototype.toString.call(1))  //[object Number]
    console.log(Object.prototype.toString.call('1'))  //[object String]
    console.log(Object.prototype.toString.call([]))  //[object Array]
    console.log(Object.prototype.toString.call(function(){}))  //[object Function]
    console.log(Object.prototype.toString.call(null))  //[object Null]
    console.log(Object.prototype.toString.call(undefined))  //[object Undefined]
  ```
* 方法1
  * 通过传入类型来实现函数返回
  ```js
  function judgeType (type,val){
    return Object.prototype.toString.call(val) == `[object ${type}]`
    }
  console.log(judgeType('Array',[1,2,3]))
  ```
  * 这种方法不太理想，每次都要传入一个类型才行，不能简便的判断其类型
* 方法2
  * 利用闭包的缓存思想，将每一种类型判断封装成一个函数返回，以后只需要单独调用即可判断改类型
  * 闭包：定义函数的作用域和执行函数的作用域不一致，就会产生闭包
  ```js
  function judgeType(type){
	return (val)=>{
		return Object.prototype.toString.call(val) == `[object ${type}]`
	    }
    }

    let util = {}
    let type = ['Array','Number','Function','Object','String','Null','Undefined']
    type.forEach(tp =>{
        util[`is${tp}`] = judgeType(tp)
    })

    console.log(util.isNumber(1)) //true
    console.log(util.isString(1)) //false
  ```
##### 柯里化概念
* 将一个函数利用高阶函数思想改便成多个函数嵌套形式，其传参由多个变成分批传入一个（让每个函数负责的功能更具体，缩小函数的范围），上述方法就是柯里化的思想
* 如何实现一个通用柯里化函数
```js
function Currying(fn){
   //获取函数长度
    let len = fn.length
   //获取剩余参数
   let allArg = Array.from(arguments).splice(1)
   return (...newArg)=>{
       allArg = [...allArg,...newArg]
       if(allArg.length >= len){
           return fn(...allArg)
       }else {
           return Currying(fn,...allArg)
       }
   }
}

function sum(a,b,c,d){
    return a+b+c+d
}

let newSum = Currying(sum,1,2)
console.log(newSum(3)(4))
```
* 如何扩大函数的范围
  * 通常原型链上的函数只能提供给拥有该原型的实例对象，通过call等方法可以将其扩展给其它类型使用
```js
function unCurrying(fn){
    return (...args)=>{
        return (Function.prototype.call).call(fn,...args)
    }
}

let toString = unCurrying(Object.prototype.toString)
console.log(toString(123))
console.log(toString('123'))
```
##### 异步并发问题
* 用node模拟一个文件的读写
```js
const fs = require("fs")
const path = require("path")
fs.readFile(path.resolve(__dirname,'./file/1.txt'),'utf-8',function(err,data){
    console.log(data)
})

fs.readFile(path.resolve(__dirname,'./file/2.txt'),'utf-8',function(err,data){
    console.log(data)
})
```
* 针对这种异步的并行请求，我们如何同步最终的结果呢，最直接的方法就是利用定时器+回调
```js
const fs = require("fs")
const path = require("path")
fs.readFile(path.resolve(__dirname,'./file/1.txt'),'utf-8',function(err,data){
    finish('1',data)
})

fs.readFile(path.resolve(__dirname,'./file/2.txt'),'utf-8',function(err,data){
    finish('2',2)
    
})

function after(timer,cb){
    let util={}
    return function(key,value){
        util[key] = value
        if(--timer === 0){
            cb(util)
        }
    }
}
const finish = after(2,function(obj){
    console.log(obj)
})
```
* 通过发布订阅模式也可以实现该效果
```js
const fs = require('fs')
const path = require('path')
// const { emit } = require('process')

const events = {
    _arr:[],
    on(callback){
        this._arr.push(callback)
    },
    emit(key,value){
        this._arr.forEach(fn=>{
            fn(key,value)
        })
    }
}

let obj = {}
//订阅
events.on((key,value)=>{
    obj[key] = value
    if(Object.keys(obj).length == 2){
        console.log(obj)
    }
})
fs.readFile(path.resolve(__dirname,'./file/1.txt'),'utf-8',function(err,data){
    //发布
    events.emit(1,data)
})
fs.readFile(path.resolve(__dirname,'./file/2.txt'),'utf-8',function(err,data){
    events.emit(2,data)
    
    
})
```
* 还有一种很常见的设计模式叫观察者模式
```js
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
```

### promise的理解及实现
#### 基于回调的异步解决方案缺陷
> js通常采用四种异步解决方案：回调、promise、Generator、async/await
* 回调解决方案
> 通常异步的操作需要放入回调中进行执行，若要执行串行异步，则容易造成回调嵌套
* promise优势
    * 通过then来实现异步的执行，解决了回调嵌套问题（本质 依然是回调）
    * 解决异步并发问题(promise.all)
    * 使错误处理变得简单
#### promise实现
* 初步实现思路
  * 基本状态实现
  * 添加then
  * 显示异步操作
  ```js
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
  ```
* 实现then的流程
  * then返回一个promise
  * then可以实现值的穿透
  ```js
  const PENDING =  "PENDING"
    const REJECTED = "REJECTED"
    const FULFILLED =  "FULFILLED"

    function resolvePromise(promise2,x,resolve,reject){
        if(promise2 === x){
            return reject(new TypeError(`Chaining cycle detected for promise #<Promise> my`))
        }
        if((typeof x === 'object' && x!==null) || (typeof x === 'function')){
            let called = false
            try{
                let then = x.then
                if(typeof then  === 'function'){
                    then.call(x,y=>{
                        if(called)return
                        called = true
                        resolvePromise(promise2,y,resolve,reject)
                    },e=>{
                        if(called)return
                        called = true
                        reject(e)
                    })
                }
                else {
                    resolve(x)
                }
            }catch(e){
                if(called)return
                called = true
                reject(e)
            }
        }else {
            resolve(x)
        }
    }

    class Promise{
        constructor(exector){
            this.status = PENDING
            this.value = null
            this.reason = null
            this.onResolveCallback = []
            this.onRejectedCallback =  []
            const resolve = (value)=>{
                if(value instanceof Promise){
                    return value.then(resolve,reject)
                }
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
            onFulfulled = typeof onFulfulled === 'function'?onFulfulled:v=>v
            onRejected = typeof onRejected === 'function'? onRejected:r=>{throw r}
            let promise2 = new Promise((resolve,reject)=>{
                if(this.status === FULFILLED){
                    setTimeout(()=>{
                        try{
                            let x = onFulfulled(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        }
                        catch(e){
                            reject(e)
                        }
                    })
                }
                if(this.status === REJECTED){
                    setTimeout(() => {
                        try{
                        let x = onRejected(this.reason)   
                        resolvePromise(promise2,x,resolve,reject) 
                        }catch(e){
                            reject(e)
                        }
                    });
                }
                if(this.status === PENDING){
                    this.onResolveCallback.push(()=>{
                        setTimeout(() => {
                            try{
                                let x = onFulfulled(this.value)
                                resolvePromise(promise2,x,resolve,reject)
                            }catch(e){
                                reject(e)
                            }
                        }); 
                    })
                    this.onRejectedCallback.push(()=>{
                        setTimeout(()=>{
                            try{
                                let x = onRejected(this.reason)
                                resolvePromise(promise2,x,resolve,reject)
                            }catch(e){
                                reject(e)
                            }
                        })
                    })
                }
            })
        return promise2
        }
    }
  ```
* promise单元测试
  * 安装测试工具 `npm install promises-aplus-tests -g`
  * 开始测试: `promises-aplus-tests mypromise.js`
  ```js
    Promise.deferred = function(){
        let dfd = {}
        dfd.promise = new Promise((resolve,reject)=>{
            dfd.resolve = resolve
            dfd.reject = reject
        })
        return dfd
    }
  ```
* Promise相关方法
* 实例方法
* catch
  ```js
   catch(onRejected){
        return this.then(null,onRejected)
    }
  ```
  * 静态方法
  * Resolve
  ```js
    Promise.Resolve = (value)=>{
        return new Promise((resolve,reject)=>{
            resolve(value)
        })
    }
  ```
  * Reject
  ```js
        Promise.Reject = (reason)=>{
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
  ```
  * all
  ```js
    Promise.all=function(value){
        return new Promise((resolve, reject) => {
        let result = []
        let times = []
        function processMap (index, data) {
            result[index] = data
            if (times++ == value.length) {
                resolve(result)
            }
        }
        for (let i = 0; i < value.length; ++i) {
            Promise.resolve(value[i]).then(data => {
                processMap(i, data)
            }, reject)
        }
        }) 
    }
  ```
  * allSettled
  ```js
    Promise.allSettled = function (value) {

        return new Promise((resolve, reject) => {
            let result = []
            let times = []
            function processMap (index, data) {
                result[index] = data
                if (times++ == value.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < value.length; ++i) {
                Promise.resolve(value[i]).then(data => {
                    processMap(i, { status: 'fulfilled', data })
                }).catch(reason => {
                    processMap(i, { status: 'rejected', reason })
                })
            }
        })
    }
  ```
  * race
  ```js
    Promise.race = function(value){
        return new Promise((resolve,reject)=>{
            value.forEach(item=>{
                Promise.resolve(item).then(resolve,reject)
            })
        })
    }
  ```
  *原型链方法
  ```js
    Promise.prototype.finally = function(finall){
        return this.then((value)=>{
            return Promise.Resolve(finall()).then(()=>value)
        }, (finall)=>{
            return Promise.Reject(finall()).then(()=>{throw reason})
        })
    }
  ```

* 将node函数转换成promise
  ```js
    function promisify(fn){
        return function(...args){
            return new Promise((resolve,reject)=>{
                fn(...args,function(err,data){
                    if(err){
                        reject(err)
                    }
                    resolve(data)
                })
            })
        }
    }

    function promisifyAll(obj){
        for(let key in obj){
            if(typeof obj[key] == 'function'){
                obj[key] = promisify(obj[key])
            }
        }
    } 
  ```
