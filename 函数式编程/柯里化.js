// function checkAge (age) {
//     let min = 18
//     return age >= 18
// }

// //普通纯函数
// function checkAge (min, age) {
//     return age >= min
// }

// checkAge(18, 24)
// checkAge(18, 20)
// checkAge(20, 30)

// //柯里化
// function checkAge (min) {
//     return function (age) {
//         return age >= min
//     }
// }

// // es6写法
// let checkAge = min => (age => age >= min)

// let checkAge18 = checkAge(18)
// checkAge18(18)
// checkAge18(20)

// const _ = require("lodash")
// //字符串匹配
// const match = _.curry(function (reg, str) {
//     return str.match(reg)
// })
// const haveSpace = match(/\s+/g)
// const haveNumber = match(/\d+/g)
// console.log(haveSpace('hello world'))
// console.log(haveNumber('25$'))

// //数组筛选
// const filter = _.curry(function (func, array) {
//     return array.filter(func)
// })

// console.log(filter(haveSpace, ['John connor', 'John_Donne']))

function curry (func) {
    return function curryFn (...arg) {
        if (arg.length < func.length) {
            return function () {

            }
        }
        else {
            return func(...arg)
        }
    }
}

