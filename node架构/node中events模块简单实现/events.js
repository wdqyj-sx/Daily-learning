const EventEmitter = require("./core")

function Girl(){

}
Object.setPrototypeOf(Girl.prototype,EventEmitter.prototype)
const girl = new Girl

girl.on('newListener',function(eventName){
    console.log('sx:',eventName)
})
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