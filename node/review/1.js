// function core (...arg) {
//     console.log('core', arg)
// }

// Function.prototype.before = function (fn) {
//     //剩余运算符，接受不定参数
//     return (...args) => {
//         fn();
//         //扩展运算发,将数组分为参数
//         this(...args)
//     }
// }

// function cb () {
//     console.log('附加的处理逻辑')
// }

// let newCore = core.before(cb)
// newCore('1', '2')  //core [ '1', '2' ]
// function isType (val, type) {
//     return Object.prototype.toString.call(val) == `[object ${type}]`
// }

// console.log(isType('123', 'Number')) //false
// console.log(isType(123, 'Number')) //true

// function isType (type) {
//     return (val) => {
//         return Object.prototype.toString.call(val) == `[object ${type}]`
//     }
// }

// let isString = isType('String')
// console.log(isString('123'))  //true
// console.log(isString(123)) //false

// function sum (a, b, c, d) {
//     return a + b + c + d
// }

// function curring (fn) {
//     let inner = (arg = []) => {
//         return arg.length >= fn.length ? fn(...arg) : (...newArg) => inner([...arg, ...newArg])

//     }
//     return inner()
// }

// console.log(curring(sum)(1)(2)(3)(4)) //10


// function isType (type, val) {

//     return Object.prototype.toString.call(val) == `[object ${type}]`
// }

// let util = {};

// ['String', 'Number', 'Null', 'Boolean', 'Undefined'].forEach(type => {
//     util['is' + type] = curring(isType)(type)
// })

// console.log(util.isString('123'))  //true
// console.log(util.isNumber(123))  //true

// const fs = require("fs")

// const events = {
//     _arr: [],
//     on: function (fn) {
//         this._arr.push(fn)
//     },
//     emit: function (data) {
//         this._arr.forEach(fn => {
//             fn(data)
//         })
//     }

// }

// let arr = []
// //订阅
// events.on((data) => {
//     arr.push(data)
//     if (arr.length >= 2) {
//         console.log(arr)
//     }
// })

// fs.readFile("./a.txt", 'utf-8', (err, data) => {
//     //发布
//     events.emit(data)
// })
// fs.readFile("./b.txt", 'utf-8', (err, data) => {
//     events.emit(data)  //[a,b]
// })

class subJect {
    constructor(name) {
        this.name = name
        this.state = '笑'
        this.observer = []
    }
    // 关联观察者
    attach (o) {
        this.observer.push(o)
    }
    //状态改变
    setState (newState) {
        this.state = newState
        //通知观察者
        this.observer.forEach(o => {
            //观察者更新状态
            o.updata(this.name, this.state)
        })
    }

}

class Observer {
    updata (name, state) {
        console.log(`${name}的状态变为:${state}`)
    }
}

//声明被观察者
const baby = new subJect("baby")
//声明观察者
const mother = new Observer()
//绑定观察者
baby.attach(mother)

baby.setState('哭') //baby的状态变为:哭