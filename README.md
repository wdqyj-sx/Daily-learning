
# Daily learning
 * 记录一下每日学习的笔记，投资自己
## 目录
- [Daily learning](#daily-learning)
  - [目录](#目录)
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
    - [从generator到async](#从generator到async)
      - [迭代器](#迭代器)
    - [浏览器事件环](#浏览器事件环)
      - [进程与线程](#进程与线程)
      - [事件环](#事件环)
      - [相关习题](#相关习题)
      - [模块源码简单实现](#模块源码简单实现)
    - [node事件环](#node事件环)
    - [node中events模块的简单实现](#node中events模块的简单实现)
      - [events的应用](#events的应用)
      - [events的简单实现](#events的简单实现)
  - [Vue3源码学习](#vue3源码学习)
    - [Vue3 环境搭建](#vue3-环境搭建)
      - [Monorepo管理项目](#monorepo管理项目)
      - [模拟打包流程](#模拟打包流程)
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
### 从generator到async
#### 迭代器
* 什么叫类数组
  * 有索引
  * 有长度
  * 能遍历
  ```js
    let likeArray = {
        0:0,
        1:1,
        2:2,
        3:3,
        length:4
    }

    let arr = [...likeArray]//报错
  ```
  > * 上述并不是类数组，因为无法进行解构，说明迭代不了
  > * 数组能遍历，是因为内部有迭代的方法，通过Symblo可以给上述类型设置迭代方法,使之成为类数组
  ```js
    const { values } = require("lodash")

    let likeArray = {
        0:0,
        1:1,
        2:2,
        3:3,
        length:4,
        get [Symbol.toStringTag](){
            return 'MyArray'
        },
        [Symbol.iterator]:function(){
            let index = 0
            return {
                next:()=>{
                    return {
                        value:this[index],done:index++==this.length
                    } 
                }
            }
        }
    }

    let arr = [...likeArray] //不报错
    console.log(arr)
    console.log(likeArray.toString())
  ```
* 生成器函数
  * 可以看到，类数组只需要有迭代器就可以遍历，而迭代器需要我们手动实现，有一个函数可以自动生成迭代器，那就是生成器函数
  ```js
    function* read(){
        yield 'vue';
        yield 'vite';
        yield 'node'
    }

    let it = read()
    console.log(it.next())  //{ value: 'vue', done: false }
  ```
  * 生成器和普通函数的区别是，前面需要加* ,并且配合yeild使用
  * 生成器返回一个迭代器，每次执行需要调用next方法，产出value,done
  * done为true时，迭代结束
  * 因此类数组中的迭代器可以修改为：
  ```js
    [Symbol.iterator]:function*(){
        let index = 0
        let len = this.length
        while(index!==len){
            yield this[index++]
        }
    }
  ```
  * 调用next通过传参可以给上一个yield的返回结果赋值,如果没有上一个yield，则传参无意义
  ```js
    function* read(){
        let a = yield 'vue'
        console.log(a) //11
        let b = yield 'vite'
        console.log(b) //1111
        let c = yield 'node'
        console.log(c) //11111
    }

    let it = read()
    console.log(it.next('1'))
    console.log(it.next('11'))
    console.log(it.next('1111'))
    console.log(it.next('11111'))
  ```
* promise和生成器函数结合
  * promise通过then解决串行执行流程
  * 通过promise.all解决并行执行流程
  * 但是promise依然是基于回调的，其并没有完全结果嵌套问题
  * 通过迭代器，可以使我们的异步串行代码更像是同步(底层依然是异步)
  ```js
    const fs = require("fs").promises
    const path = require("path")
    function* read(){
        let name = yield fs.readFile(path.resolve(__dirname,'name.txt'),'utf-8')
        let age = yield fs.readFile(path.resolve(__dirname,name),'utf-8')
        return age
    }
  ```
  * 但是转换成迭代器的时候依然很复杂
  ```js
    let it = read()
    let {value,done} = it.next()
    if(!done){
        value.then(data=>{
            let {value,done} = it.next(data)
            if(!done){
                value.then(data=>{
                    let {value,done} = it.next(data)
                    if(done){
                        console.log(value)
                    }
                })
            }
        })
    }
  ```
  * tj写了一个co库专门处理这个流程，我们也可以简单实现一个co库，来处理我们的生成器函数中的promise的串行调用问题
  ```js
    function co(it){
    return new Promise((resolve,reject)=>{
        function next(val){
                let {value,done} = it.next(val)
                if(!done){
                    value.then((data)=>{
                        next(data)
                    },(err)=>{
                        reject(err)
                    })
                }
                else {
                    resolve(value)
                }
        }
        next()
    })
    }
    co(read()).then(data=>console.log(data))
  ```
  * 将生成器函数放入babel中进行还原，可以看到它的源码大概如下：
  ```js
    var _marked = /*#__PURE__*/regeneratorRuntime.mark(read);

    function read() {
        var a, b, c;
        return regeneratorRuntime.wrap(function read$(_context) {.
            while (1) { // while(true) 表示这个东西是一个状态机，根据状态的变化实现对应的逻辑， 这个逻辑会走多次
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return 'vue';

                    case 2:
                        a = _context.sent;
                        console.log(a, 'a');
                        _context.next = 6;
                        return 'vite';

                    case 6:
                        b = _context.sent;
                        console.log(b, 'b');
                        _context.next = 10;
                        return 'node';

                    case 10:
                        c = _context.sent;
                        console.log(c, 'c');

                    case 12:
                    case "end":
                        return _context.stop();
                }
            }
        }, _marked);
    }

  ```
  * 结合之前迭代器的知识可以分析这个源码流程
    * 调用read函数返回一个迭代器，即regeneratorRuntime.wrap()返回一个迭代器
    * 迭代器包含一个next方法，调用next方法返回value和done
    * 而wrap里面的回调是一个状态机用来获取yeild后面对应的结果
      * 那么wrap回调的结果是value
      * 回调传入context来保证swith走哪一步,说明context里面包含对应的指针
      * next可以传参给上一个yield的返回值,从而加入到switch流程中，说明context中必定会记录next函数的传参
      * 通过调用next来实现switch进入哪一步，说明next中会调用wrap,wrap中的switch每走到下一步，会控制指针指向下下一个
    * 因此我们可以尝试还原regeneratorRuntime类
  ```js
    const regeneratorRuntime = {
        mark(fn){
            return fn
        },
        wrap(iteratorFn){
            const _context = {
                next:0,
                sent:null,
                done:false,
                stop(){
                    _context.done=true
                }

            }
        return  {
            next(val){
                _context.sent =val
                return {
                    value:iteratorFn(_context),
                    done:_context.done
                }
        }
        }
        }
    }
  ```
  * 而async和await就是 co和生成器函数配合promise的语法糖，而async成为目前解决异步串行的最终方法
  ```js
    const fs = require("fs").promises
    const path = require("path")

    async function read(){
        let name = await  fs.readFile(path.resolve(__dirname,'name.txt'),'utf-8')
        let age = await  fs.readFile(path.resolve(__dirname,name),'utf-8')
        return age
    }

    read().then(data=>{
        console.log(data)
    })
  ```
### 浏览器事件环
#### 进程与线程
* 计算机分配任务是以进程来分配，进程中包含着线程
* 浏览器是一个进程，而且是一个多进程模型（多进程好处就是一个进程挂掉不会影响其它进程）
  * 一个tab就是一个独立的进程
  * 浏览器默认有一个主进程，来调度其它进程（进程间的通信）
  * 插件也有独立的进程管理
  * gpu有绘图进程
* 浏览器的渲染进程
  * ui 渲染线程  负责页面渲染，布局，绘制
  * js引擎线程 执行js代码的
    * 这两种线程是互斥的，不能同时执行，原因是js引擎可能会操作dom，而渲染进程依赖dom
* js是单线程的，但主要指的是主线程，在主线程执行的时候，同时会开启一下独立的线程，如：
  * 定时器、发请求、用户事件、
#### 事件环
* 执行异步任务时，主线程会开辟独立的线程处理
  * js执行顺序是先执行同步任务，执行完当前同步任务之后，开始执行异步任务，而负责调度这些任务执行的也是一个线程，叫做事件触发线程，也就是浏览器的eventLoop事件环
* 异步任务分为宏任务和微任务
  * 宏任务 macro-task:script脚本， ui渲染，定时器(setTimeout)， 发请求， 用户事件，messageChannel, setImmediate(ie下有，比setTimeout性能好)
  * 微任务 micro-task： Promise.then(语言本身提供的)， queueMicrotashk  MutationObserver （异步监控dom的变化）
* eventLoop执行流程
  * 当前的主线程的同步任务可以看作一个最开始的宏任务
  * 代码执行的过程的时候 会产生微任务和宏任务
  * 当发生的宏任务时间到达的时候会被发入到宏任务队列中 (放入是回调) 宏任务只有一个队列
  * 微任务是立刻放到队列中 （每次执行宏任务的时候会产生一个微任务队列）
  * 当前宏任务执行完毕后，会清空本轮产生的微任务, 如果执行微任务的时候又产生了微任务，会放到当前微任务的尾部
  * 再去扫描宏任务队列，如果有则取出第一个宏任务 ， 再去执行
  * 每次微任务是执行一批 ， 宏任务是执行一个
#### 相关习题
* ```js
    <script>
            document.body.style.background = 'red';
            console.log(1)
            Promise.resolve().then(()=>{
                console.log(2)
                document.body.style.background = 'yellow';
            })
            console.log(3);
    </script>
  ```
  * 渲染线程发生在微任务之后，所以是 1 3 2 yellow
* ```js
    <script>
            button.addEventListener('click',()=>{
                console.log('listener1');
                Promise.resolve().then(()=>console.log('micro task1'))
            })
            button.addEventListener('click',()=>{
                console.log('listener2');
                Promise.resolve().then(()=>console.log('micro task2'))
            })
            button.click(); // click1() click2()
    </script>
  ```
  * 代码自动触发，相当于同步，会先输出listener1、listener2、其次处理微任务
* ```js
    <button id="1">1</button>
        <button id="2">2</button>

        <script>
            let button1 = document.getElementsByTagName("button")[0]
            let button2 = document.getElementsByTagName("button")[1]

            button1.addEventListener('click',()=>{
                console.log('listener1');
                Promise.resolve().then(()=>console.log('micro task1'))
            })
            button2.addEventListener('click',()=>{
                console.log('listener2');
                Promise.resolve().then(()=>console.log('micro task2'))
            })
            // button.click(); // click1() click2()
    </script>
  ```
  * 点击执行，相当于执行两个宏任务，会先输出第一个宏任务里的同步代码listener1、在输出微任务micro task1，然后在执行第二个宏任务
* ```js
        <script>
            Promise.resolve().then(() => {
                console.log('Promise1')
                setTimeout(() => {
                    console.log('setTimeout2')
                }, 0);
            })
            setTimeout(() => {
                console.log('setTimeout1');
                Promise.resolve().then(() => {
                    console.log('Promise2')
                })
            }, 0);
    </script>
  ```
  * 先执行完当前同步任务遗留的微任务，输出Promise1,其次按顺序执行宏任务，输出setTimeout1，再执行当前宏任务下的微任务输出Promise2,在执行输出setTimeout2
* ```js
    console.log(1);
    async function async () {
        console.log(2);
        await console.log(3);
        console.log(4)
    }
    setTimeout(() => {
        console.log(5);
    }, 0);
    const promise = new Promise((resolve, reject) => {
        console.log(6);
        resolve(7)
    })
    promise.then(res => {
        console.log(res)
    })
    async (); 
    console.log(8);
  ```
  * 先执行同步  1、6、2、3、8在执行微任务7、4、在执行宏任务5






### node中require加载机制
> node中的模块加载规范为commonJS规范，规范中通过require来引入模块。
#### require源码探究
* 暴漏出一个text模块
  ```js
    let str = 'hello world'
    module.exports = str
  ```
* node中的源码无法通过打断点进行调试，这里借助vscode，在debug模式中，新建launch.js文件，并且将"skipFiles"内容 清空，表示不跳过node核心代码,然后在require处打断点，即可进入require内部源码中
  ```json
    {
        // 使用 IntelliSense 了解相关属性。 
        // 悬停以查看现有属性的描述。
        // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
        "version": "0.2.0",
        "configurations": [
            {
                "type": "pwa-node",
                "request": "launch",
                "name": "Launch Program",
                "skipFiles": [
                    // "<node_internals>/**"
                ],
                "program": "${workspaceFolder}\\node架构\\require加载\\require加载.js"
            }
        ]
    }
  ```
* 分析源码执行流程：
  * require一个模块后，默认调用Module._load方法,传入require的文件名
  * 通过Module._resolveFilename方法，解析文件名，此时会默认添加文件的后缀，返回文件路径
  * 创建当前模块实例const module =  new Module() => {id:文件名,exports:{}}
  * 调用module.load()方法，传入解析的文件名
  * 根据文件的后缀名来调用相关的读取方法 Module._extensions[extension](this, filename);
    * 此时会将模块内容读出来，内容为字符串形式
  * 调用module._compile方法，通过该方法将text的内容包装成一个函数字符串
    ```js
    function(){
        let str = 'hello world'
        module.exports = str
    }
    ```
  * 通过vm.compileFunction()执行该字符串变成一个真的函数并执行，执行会把数据给module.exports  
  * 最终返回module.exports
#### 模块源码简单实现
* 调用require，会执行Module类中的一些列方法，首先要创建Module类，并分别添加相对应方法
  ```js
    function Module(id){
        this.id = id
        this.export = {}
    }
  ```
* 对文件的全局路径查找
  * require中传入的参数本质上是一个文件名，这个文件名可以不加后缀，依次在查找的时候 需要考虑
    * 若有后缀，则直接拼接路径，存在该路径下的文件，则返回
    * 若无后缀，则需在第一步基础上不断拼接可能的后缀，同时判断该路径是否存在文件，若存在，则返回
    * 两种情况都不符合，则报错
  ```js
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
        '.js'(){},
        '.json'(){}
    }
  ```
* 之后创建一个新的module实例
* 调用实例中的load方法，截取扩展名
  ```js
    Module.prototype.load = function(filename){
        let ext = path.extname(filename)
        Module._extension[ext](this)
    }
  ```
* 调用Module._extension方法对引入的文件进行内容读取,使用函数包裹模块内容，调用函数，将内容给module.exports
  ```js
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
  ```
* 最终myRequire函数为：
  ```js
    function myRequire(id){
        //获取完整路径
    let absPath = Module._resolveFilename(id)
    const module = new Module(absPath)
    module.load(absPath)
    return module.exports
    }
  ```
* 测试
    ```js
        let str = myRequire('./text')
        console.log(str)  //hello world
    ```
### node事件环
> node中事件环和浏览器的事件环并不相同
* node中有6个任务队列，当同步任务完成后，异步任务会根据类型分别放入这6个任务队列中，且这六个队列的执行顺序也不相同
   ┌───────────────────────────────────┐
┌─>│timers(计时器)执行                  │
│  |setTimeout以及setInterval的回调     │
│  └──────────┬────────────────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│   处理网络，流，TCP的错误  │  
│  │      callback      │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  │    node内部使用        │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │poll（轮询）            │<─────┤  connections, │
│  │ 执行poll中的i/o队列检查 │      │data, etc.    │
│  │定时器是否到时          │      └───────────────┘
│  └──────────┬────────────┘          
│  ┌──────────┴────────────┐      
│  │        check          │
│  │  存放setImmediate回调  │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   │ 关闭的回调例如         │
   │ socket.on('close')    │
   └───────────────────────┘

* 当同步任务执行完之后，会从timer任务开始执行，然后这里的回调执行完，依次向下找下一个队列
* timer里存储的是定时器回调，当定时器时间到达，循环机制跳回到这个队列，执行里面的回调，否则走下面的队列
```js
    setTimeout(function(){
        console.log('setTimeout')
    },0)

    setImmediate(function(){
        console.log('setImmediate')
    })
```
* 根据之前的解释，如果定时器到时间，那么timer里面关于该定时器的回调会执行，然后，再执行后面的队列，而check队列，明显再timer队列之后
* 但是上述代码的输出却不确定
  * 因为在同步运行的时候，虽然定时器是0，但是代码可能因为性能或者其它原因，开始计时的时间不确定，因此同步执行完之后，可能计时器还没开始工作，因此timer队列可能不会先执行，而是执行后面的队列，后面定时器到时间了，反过来执行timer
  * 因此上述代码谁先输出不确定
```js
    require('fs').readFile('./node事件环.md',(err,data)=>{
        setTimeout(function(){
            console.log('setTimeout')
        },0)

        setImmediate(function(){
            console.log('setImmediate')
        })
    })
```
* 上述结果输出setImmediate、setTimeout
* 在第一轮循环机制中，check没有内容，因此循环会停留（堵塞）在poll轮询队列中，等待其出现内容，或者timer中时间到，调用其回调
* 在等到poll中有了回调后，开始执行回调，
* 然后进入下一个队列执行内容
* 下一个队列为check队列，所以执行setImmediate
### node中events模块的简单实现
> node中events模块是一个发布订阅类
#### events的应用
* 简单的发布订阅
```js
    const EventEmitter = require("events")
    const { grep } = require("jquery")

    const girl = new EventEmitter()

    //订阅
    girl.on('失恋了',function(boy){
        console.log('哭',boy)
    })
    girl.on('失恋了',function(boy){
        console.log("吃",boy)
    })

    function sleep(boy){
        console.log('sleep')
    }
    girl.on('失恋了',sleep)
    //订阅
    girl.emit('失恋了','小明')

    //取消订阅
    girl.off('失恋了',sleep)

    girl.emit('失恋了','小明') //再次执行，没有sleep

    //只执行一次
    girl.once('失恋了',function(boy){
        console.log('健身')
    })

    girl.emit('失恋了','小明')
    girl.emit('失恋了','小明') //再次执行没有健身

```
  * 实例化一个events之后，通过on来实现订阅，提供订阅名和执行的行为
  * 通过emit来发布之前的订阅，通过emit触发的订阅名，执行之前的行为
  * off可以取消之前的订阅
  * once函数可以实现只发布一次，即执行一次之后改订阅失效   
#### events的简单实现
* 声明一个构造函数，构造函数中有一个对象（队列），用来存储订阅
* 该构造函数的原型上有四个方法，分别是on、emit、off、once
```js
function EventEmitter () {
    this._events = {}
}

```
* 调用on
 * 先用on进行订阅，这里要考虑函数通过绑定原型的方式和EventEmitter类关联，然后再通过实例化这个函数来调用EventEmitter相关的原型方法，此时实例是没有_events属性的，因此要进行一次判断
 * 属性名不是newListener，需要调用newListener方法
 * 根据属性名依次追加行为到对应数组
  ```js
    EventEmitter.prototype.on = function (eventName, callback) {
        if (!this._events) {
            this._events = {}
        }
        if (eventName !== "newListener") {
            if(this._events["newListener"]){
                this._events["newListener"].forEach(fn=>fn(eventName))
            }
        }
        this._events[eventName] = this._events[eventName] || []
        this._events[eventName].push(callback)
    }
  ```
* 调用emit
  * 通过属性，依次遍历行为数组，调用该行为
  ```js
    EventEmitter.prototype.emit = function (eventName, ...args) {
        if (!this._events) {
            this._events = {}
        }
        this._events[eventName].forEach((cb) => {
            cb(...args)
        })
    }
  ```
* 调用off 
  * off方法对对应的属性上的行为进行取消
  ```js
    EventEmitter.prototype.off = function (eventName, callback) {
        if (!this._events) {
            this._events = {}
        }
        this._events[eventName] = this._events[eventName].filter(item => {
            return item !== callback && item.l !== callback
        })
    }
  ```
* once 方法
  * 利用高阶函数，绑定另一个函数，函数里面执行完callback后，取消该函数
  * 该函数属性l绑定callback，这样可以通过off进行取消
  ```js
    EventEmitter.prototype.once = function (eventName, callback) {
        let once = (...args) => {
            callback(...args)
            this.off(eventName, once)
        }
        once.l = callback
        this.on(eventName, once)
    }

  ```
* 导出
```js
    module.exports = EventEmitter
```
## Vue3源码学习
### Vue3 环境搭建
#### Monorepo管理项目
> Monorepo是管理项目代码的一种方式，指在一个项目仓库管理多个模块/包，Vue3源码采用Monorepo进行管理
  * 一个仓库可以维护多个模块。
  * 方便版本管理何依赖管理，模块之间的引用，调用都很便捷。
  * Vue3使用pnpm workspace实现monorepo
    * 全局安装pnpm:npm install pnpm -g
    * pnpm init 初始化项目
    * 创建pnpm-wrokspace.yaml文件
      * 告诉pnpm，文件的包都安装再packages文件夹下：
      ```js
        packages:
          - 'packages/*'
      ```
  * 这样，基本的Monorepo环境就配置好了,创建packages文件夹,然后在里面创建两个项目文件夹，分别为reactivity、shared
  * 安装vue,并指定安装在根目录（-w）
    * pnpm install vue -w
  * 安装相关模块依赖
    * -D指开发依赖
    * pnpm install esbuild typescript minimist -D -w
#### 模拟打包流程
  * 分别初始化模拟的两个项目（reactivity和shared）
    * 并配置打包后的引用路径,package.json内容如下：
     ```js
        {
        "name": "@vue/reactivity",
        "version": "1.0.0",
        "description": "",
        "main": "dist/reactivity.cjs.js",
        "module": "dist/reactivity.esm-bundler.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
        }
 
     ```
     ```js
            {
        "name": "@vue/shared",
        "version": "1.0.0",
        "description": "",
        "main": "dist/shared.cjs.js",
        "module": "dist/shared.esm-bundler.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
        }

     ```
  * 创建ts配置文件
    * pnpm tsc --init
    * 配置tsconfig.json文件
    ```json
    {
    "compilerOptions": {
        "outDir": "dist", // 输出的目录
        "sourceMap": true, // 采用sourcemap
        "target": "es2016", // 目标语法
        "module": "esnext", // 模块格式
        "moduleResolution": "node", // 模块解析方式
        "strict": false, // 严格模式
        "resolveJsonModule": true, // 解析json模块
        "esModuleInterop": true, // 允许通过es6语法引入commonjs模块
        "jsx": "preserve", // jsx 不转义
        "lib": ["esnext", "dom"], // 支持的类库 esnext及dom,
        "baseUrl":".",
         "paths": {
        "@vue/*":["packages/*/src"]
      }
        }
    }
    ```
    * 通过配置baseUrl，可以通过"@vue"来访问package/*/src文件
  * 配置项目内容
    * 在shared的src文件夹下创建index.ts文件，创建检测对象的方法
    ```ts
        export const isObject = (value)=>{
        return typeof value === 'object'&& value !==null
    }
    ```
    * 在reactivity的src的index.ts文件中引用
    ```ts
    import { isObject } from "@vue/shared"
    console.log(isObject('abc'))
    ```
  * 配置打包文件
    * 根目录新建scripts/dev.js
    * package.json添加scripts选项
    ```json
        "scripts": {
        "dev":"node scripts/dev.js reactivity -f global"
    },
    ```
      * 表示dev命令会运行dev.js ，并处理reactivity,global表示全局，cjs表示commonjs规范，esm表示esmodule规范
    * 配置dev.js
      * 引入minimist来解析参数  
      ```js
        const args = require("minimist")(process.argv.slice(2))

        console.log(args)

      ```
      * 运行npm run dev查看输出结果为：{ _: [ 'reactivity' ], f: 'global' }
      * 最终文件如下:
      ```js
            const args = require("minimist")(process.argv.slice(2))
        const path = require('path')

        //对接收的文件做处理
        const target = args._[0] || 'reactivity'
        const format = args.f||'global'
        const entry = path.resolve(__dirname,`../packages/${target}/src/index.ts`);
        //定义打包格式
        // iife 自执行函数 global  (function(){})()  增加一个全局变量
        // cjs  commonjs 规范
        // esm es6Module
        const outputFormat = format.startsWith('global')?'iife':format === 'cjs'?'cjs':'esm'
        //出口文件
        const outfile = path.resolve(__dirname,`../packages/${target}/dist/${target}.${format}/index.js`)

        //引入打包模块
        const {build} = require('esbuild');

        build({
            entryPoints: [entry],
            outfile,
            bundle: true,
            sourcemap: true,
            format: outputFormat,
            // globalName,
            platform: format === 'cjs' ? 'node' : 'browser',
            watch: { // 监控文件变化
                onRebuild(error) {
                    if (!error) console.log(`rebuilt~~~~`)
                }
            }
        }).then(() => {
            console.log('watching~~~')
        })

      ```
      * 运行npm run dev 即可打包文件
### Vue3数据绑定的实现
#### Vue3的数据绑定
> 不同于Vue2中的defineProperty方法，Vue3中采用proxy实现对数据的绑定，这种方式有以下好处：
* 无需重写getter和setter对数据进行劫持
* 无需实现$set和$delete方法实现对新增和删除属性的监控
* 不许对数组进行单独处理
> Vue3通过reactive模块来实现数据绑定，通过effect模块实现数据的更新
```js
 const {effect,reactive } = Vue
        //对数据进行绑定
        const obj = {
            name:'sx',
            age:13,
            address:{
                num:30
            },
            flag:true
        }
        //这里只能传入对象，因为proxy只支持对象格式
        const state = reactive(obj)
        //数据响应
        //effect函数会默认执行一次，后续数据发生变化会重新执行effect函数
        effect(()=>{
            app.innerHTML = state.name+'今年'+state.age+'岁了门牌号是'+state.address.num
        })
        setTimeout(()=>{
            state.age++
        },1000)
```
#### reactive模块的实现
> 根据其借助proxy的原理，可以实现reactive模块中的数据劫持
* 新建reactive.ts文件，用于实现主要逻辑
```js
import {isObject} from "@vue/shared"

export function reactive(target){
    //传入的值需要是一个对象，如果不是，则不需要进行绑定
    if(!isObject(target)){
        return target
    }
}
```
* 原index.ts负责导出reactive模块
```js
export {reactive} from "./reactive"
```
* 在reactive中实现初步的proxy代理
```js
//实现最初的proxy
    const proxy = new Proxy(target,{
        get(target,key,receiver){
            console.log('这个属性被取到了')
            return target[key]
        },
        set(target,key,value,receiver){
            console.log('这个属性改变了')
            target[key] = value;
            return true
        }
    })
    return proxy
```
  > 对数据进行绑定的意义，在于当数据变化时可以随时更新页面，这里通过get方法，当数据被访问时，就可以和effect绑定，当该属性触发set函数时，同样触发effect更新即可实现数据的劫持  
> 但是这种设置却有很大的问题，那就是对象的this指向问题
* 对象一
```js
let person = {
    name:'sx',
    age(){
        return 18
    }
}
const proxy = new Proxy(person,{
    get(target,key,receiver){
        console.log('这个属性被取到了')
        return target[key]
    },
    set(target,key,value,receiver){
        console.log('这个属性改变了')
        target[key] = value;
        return true
    }
})

proxy.name
proxy.age

```
> 可以看到，这种对象用proxy可以顺利绑定每一个属性，但是下面这个却不能
* 对象二
```js
let person = {
    name:'sx',
    get age(){
        return this.name
    }
}
const proxy = new Proxy(person,{
    get(target,key,receiver){
        console.log('这个属性被取到了')
        console.log(key)
        return target[key]
    },
    set(target,key,value,receiver){
        console.log('这个属性改变了')
        target[key] = value;
        return true
    }
})


proxy.age

```
> 这里访问proxy.age，按照设想和代码逻辑，当触发get之后，age属性会和effect进行绑定，当age属性值变化后，set中会让effect进行更新

> 但是这里的age依赖的却是name，也就是说，当name发生改变时，实际上age的返回值也会发生改变，但是proxy却监听不到，也就无法触发effect对age进行更新

> 这里的原因就是，age中的this指的是person对象，当通过proxy.age访问时，只会触发age属性的get,而不会触发name属性的get,自然当name变化时，effect不会触发更新

> 要解决这个办法，只需要把this的指向改为proxy对象即可，而Reflect对象即可完成这件事
```js
let person = {
    name:'sx',
    get age(){
        return this.name
    }
}
const proxy = new Proxy(person,{
    get(target,key,receiver){
        console.log('这个属性被取到了')
        console.log(key)
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log('这个属性改变了')
        target[key] = value;
        return Reflect.set(target,key,value,receiver)
    }
})


proxy.age

```
> 此时访问proxy.age，会同时触发age的get和name的get
> 事实上，每次进行Proxy绑定对象属性也会对性能有所消耗，因此要尽可能减少proxy的使用,reactive接收一个对象，如果用户多次输入同一个对象，则没有必要每次对对象进行Proxy，只需要从缓存里拿就好

* 情况一：用户输入同一数据对象
  * 新建weakMap对象，判断是否存在该数据对象即可
  ```js
   const existing = reactiveMap.get(target)
    if(existing){
        return existing
    }
  ```
  * 在创建好proxy之后，存入weakMap中
  ```js
    reactiveMap.set(target,proxy)
  ```
* 情况二：用户第二次传入数据对象对应的proxy
```js
 const state = reactive(obj)
 const state2 = reactive(state)
```
> 如果第二次传入的是proxy实例，则只需要触发其get方法验证，如果get能触发，则说明是proxy，直接返回即可
  * 新建枚举对象
  ```js
    export const enum ReactiveFlags {
        IS_REACTIVE = '__v_isReactive'
    }
  ```
  * 触发get
  ```js
  if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }
  ```
  * get中进行判断
  ```js
   if(key === ReactiveFlags.IS_REACTIVE){
                return true
            }
  ```
> 自此实现了Vue3中的数据绑定
### 数据更新函数effect的实现
#### 基本思路
* reactive函数对数据进行proxy劫持
* 调用effect函数，传入用户定义函数
* 用户定义函数会自执行一次，其内存在对数据的调用
* 对数据的调用会触发proxy接触
  * 如果是触发get,则把当前触发的属性和当前effect绑定
  * 如果触发set，则把当前属性绑定的effect取出，并调用，使之进行数据更行
```js
 const {effect,reactive } = VueReactivity
        //对数据进行绑定
        const obj = {
            name:'sx',
            age:13,
            address:{
                num:30
            },
            flag:true
        }
        //这里只能传入对象，因为proxy只支持对象格式
        const state = reactive(obj)
        // const state2 = reactive(state)
        //数据响应
        //effect函数会默认执行一次，后续数据发生变化会重新执行effect函数
        effect(()=>{
            app.innerHTML = state.name+'今年'+state.age+'岁了门牌号是'+state.address.num
        })
        setTimeout(()=>{
            state.age++
        },1000)
```
#### 实现细节
##### ReactiveEffect类
> ReactiveEffect类是effect的构造函数，其内部有控制传入的函数执行的函数run
* 声明effect函数，实质是在内部实例化一个ReactiveEffect对象，并调用其run函数实现初次effect的执行，从而触发proxy，
```js
export function effect(fn){
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}
```
* run函数的作用不仅是执行其传入的回调，触发proxy,同时会将上下文暴漏给外部，赋值给activeEffect，由于js执行机制为单线程，因此当暴漏出指针后，触发proxy的get或者set,利用track函数进行依赖收集
```js
 run(){
        //依赖收集，让属性和effect产生关联
        //如果没有激活，则不进行依赖收集
        if(!this.active){
            return this.fn()
        }else {
           try{
               //让activeEffect指向当前effect，
                activeEffect = this
                //触发react中的get或set
                return this.fn()
           }
           finally{
                activeEffect = undefined
           }
        }
    }
```
##### 依赖收集函数track
* 当触发proxy中的get，会调用依赖收集函数track，收集属性对应哪个effect，主要格式为：obj -> key -> effect。
```js
const targetMap = new weakMap()
export function track(target,key){
    if(activeEffect){
       //判断是否存在该对象的键值
       let depsMap = targetMap.get(target)
       if(!depsMap){
            targetMap.set(target,(depsMap = new Map()))
       }
       //判断是否存在该属性的键值
        let deps = depsMap.get(key)
        if(!deps){
            depsMap.set(key,(deps = new Set()))
        }
        trackEffects(deps)
    }

}
export function trackEffects(deps){
    let shouldTrack = !deps.has(activeEffect)
    if(shouldTrack){
        deps.add(activeEffect)
    }
    // 在ReactiveEffect中声明公有变量deps，用来存储属性对应的集合deps
    activeEffect.deps.push(deps)
}
```
##### 触发更新函数trigger
* 触发更新函数trigger在proxy的set中，当传进来的新值不等于旧值时，执行set的赋值操作，并触发trigger,trigger函数中会取出该属性所依赖的effect，依次执行其中的run函数，这样就完成了数据的更新
```js
export function trigger(target,key,value){
    let depMaps = targetMap.get(target)
    if(!depMaps){
        return //没有依赖收集
    }
    let effects = depMaps.get(key)
    triggerEffects(effects)
}

export function triggerEffects(effects){
    if(effects){
        effects.forEach(effect=>{
            effect.run()
        })
    }
}
```
##### 细节完善
> 至此，我们根据最初的范例，已经能够实现数据改变，页面更新的效果,但是依然还有一些细节需要完善
* effect的嵌套问题
```js
  effect(()=>{
      effect(()=>{
                state.age = 18
            })
            app.innerHTML = state.name+'今年'+state.age+'岁了门牌号是'+state.address.num
          
        })
```
> 我们通过用activeEffect记录effect内部实例的方式来暴漏出effect，从而实现依赖收集，到那时effect的run函数执行完之后，activeEffect会赋值为undefined，这就暴漏一个问题,activeEffect起初指向外层effect，然后指向内层effect，再然后执行完内层effect被赋值为undefined，但是外层还没有进行依赖收集，此时进行依赖收集将无法找到绑定的effect

> 这种嵌套的调用类似一种树状结构，因此我们可以用activeEffect记录当前环境，当环境改变，记录其parent即可
```js
run(){
    if(!this.active){
        return this.fn()
    }else {
        try{
            this.parent = activeEffect
            activeEffect = this
            return this.fn()
        }
        finally{
            activeEffect = this.parent
            this.parent = null
        }
    }
}
```
* effect调用自己的问题
```js
 effect(()=>{
            state.age = Math.random()
            app.innerHTML = state.name+'今年'+state.age+'岁了门牌号是'+state.address.num
          
        })
        setTimeout(()=>{
            state.age++
        },1000)
```
> 当effect完成依赖收集后，调用setTimeout函数，触发proxy的set,从而触发trigger更新，但是触发的过程中遇到 app.age = Math.random() ，会重复触发，使程序停不下来

> 这种明显是我们不想看到的，因此再触发的时候可以进行判断，如果触发的effect和当前的activeEffect相同,则不进行更新操作
```js
effects.forEach(effect=>{
    if(effect !== activeEffect){
        effect.fn()
    }
})
```
* 清除多余依赖
```js
  effect(() => {
            console.log('render')
            app.innerHTML = state.flag ? state.name + '今年' + state.age + '岁了门牌号是' + state.address.num : 'hello world'
        })
        setTimeout(() => {
            state.flag = false
            setTimeout(() => {
                state.age++
            }, 1000);
        }, 1000)
```
> effect进行依赖收集之后，调用外面的定时器，会将数据隐藏，此时再调用里面定时器改变age的值，页面依然刷新，这对性能印象很大

> 解决这个问题就需要对依赖进行清除，当之前run函数进行依赖收集之前，将属性对该effect产生的依赖进行清除
```js
function cleanEffect(effect){
    let deps = effect.deps
    for(let i = 0;i<deps.length;++i){
        deps[i].delete(effect)
    }
    effect.deps.length = 0
}
```
>这样并不能解决问题，反而造成程序死循环，原因就是在进行trigger更新的时候，会循环遍历effect，依次执行run,再run 中又会cleaneffect依赖，重新收集依赖,从而造成死循环
> 要解决这个方法只需要trigger时，新建一个effects集合即可
```js
if(effects){
    effects = new Set(effects)
    effects.forEach(effect=>{
         if (effect !== activeEffect) { // 保证要执行的effect不是当前的effect
                    effect.run(); // 数据变化了，找到对应的effect 重新执行
                
            }
    })
}
```
* effect返回值
> effect可以返回一个值runner，其包含了停止更新的函数stop，也可以手动控制更新runner()

  * ReactiveEffect中新增一个stop函数
```js
  stop(){
        if(this.active){
            this.active = false
        }
        cleanEffect(this)
    }
```  
  * effect中新增返回值runner
```js
export function effect(fn){
    const _effect = new ReactiveEffect(fn)
    _effect.run()
    let runner = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}
```  
```js
  let runner = effect(() => {
            console.log('render')
            app.innerHTML = state.flag ? state.name + '今年' + state.age + '岁了门牌号是' + state.address.num : 'hello world'
        })
        runner.effect.stop()
        setTimeout(() => {
            state.flag = false
            setTimeout(() => {
                state.age++
            }, 1000);
        }, 1000)
```
> 可以看到，调用stop后，数据不再更新,重新调用runner，页面继续更新
```js
  let runner = effect(() => {
            console.log('render')
            app.innerHTML = state.flag ? state.name + '今年' + state.age + '岁了门牌号是' + state.address.num : 'hello world'
        })
        runner.effect.stop()
        setTimeout(() => {
            
            state.flag = false
            runner()
        }, 1000)
```
* 更新调度函数的实现
```js
 let runner = effect(() => {
            console.log('render')
            app.innerHTML = state.flag ? state.name + '今年' + state.age + '岁了门牌号是' + state.address.num : 'hello world'
        })
        setTimeout(() => {
            state.age++
            state.age++
            state.age++

        }, 1000)
```
> 这里页面会渲染三次，而不会是等age全部更新完渲染一次,可以采用promise异步来做调度
```js
 let runner = effect(() => {
            console.log('render')
            app.innerHTML = state.flag ? state.name + '今年' + state.age + '岁了门牌号是' + state.address.num : 'hello world'
            if(flag){
                flag = false
            
                Promise.resolve().then(()=>{
                    runner()
                })
            }
        })
        setTimeout(() => {
            state.age++
            state.age++
            state.age++

        }, 1000)
```
> effect同样自身也实现了调度函数，即effect可以传递第二个参数，为一个对象，对象中如果有scheduler函数，则数据变化执行scheduler函数，如果没有，则执行effect.run
```js
    let flag = true
      let runner = effect(() => {
            console.log('render')
            app.innerHTML = state.flag ? state.name + '今年' + state.age + '岁了门牌号是' + state.address.num : 'hello world'
           
        },{
            scheduler(){
                if(flag){
                flag = false
            
                Promise.resolve().then(()=>{
                    runner()
                })
            }
            }
        })
        setTimeout(() => {
            state.age++
            state.age++
            state.age++

        }, 1000)
```
>在triggerEffects函数中进行判断
```js
export function triggerEffects(effects) {
   
    if(effects){
        effects = new Set(effects)
        effects.forEach(effect =>{
            if(effect !== activeEffect){
                if(effect.scheduler){
                    effect.scheduler()
                }else{
                    effect.run()
                }
            
            }
        })
    }
}
```
* 对引用类型进行数据绑定
> 通过proxy进行绑定的数据只是对obj最外层做代理，里面不会被监控到
```js
    let runner = effect(() => {
            console.log('render')
            app.innerHTML = state.flag ? state.name + '今年' + state.age + '岁了门牌号是' + state.address.num : 'hello world'
           
        },{
            scheduler(){
                if(flag){
                flag = false
            
                Promise.resolve().then(()=>{
                    runner()
                })
            }
            }
        })
        setTimeout(() => {
          state.address.num = 40

        }, 1000)
```
> 如上，改变state.address.num不会触发更新,但是在访问到state.address时，会触发，只需要在触发的时候做一层判断即可
```js
 get(target,key,receiver){
        if(key === ReactiveFlags.IS_REACTIVE){
            return true
        }
       track(target,key)
        
        let res = Reflect.get(target,key,receiver)
        if(isObject(res)){
            return reactive(res)
        }
        return res
    },
```