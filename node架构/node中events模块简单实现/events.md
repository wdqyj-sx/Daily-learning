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
* 调用on
 *  
