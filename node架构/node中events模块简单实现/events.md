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