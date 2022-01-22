// //组合函数
// function compose (f, g) {
//     return function (x) {
//         return f(g(x))
//     }
// }

// function first (arr) {
//     return arr[0]
// }

// function reverse (arr) {
//     return arr.reverse()
// }

// let last = compose(first, reverse)
// console.log(last([1, 2, 3, 4, 5]))
// const _ = require("lodash")



// const f = _.flowRight(toUpper, first, reverse)
// console.log(f(['one', 'two', 'three']))

//实现flowRight
function compose (...fns) {
    return (value) => {
        return fns.reverse().reduce(function (arr, fn) {
            return fn(arr)
        }, value)
    }
}
const toUpper = s => s.toUpperCase()
const reverse = arr => arr.reverse()
const first = arr => arr[0]
const check = v => {
    console.log(v)
    return v
}
const f = compose(toUpper, first, reverse)
console.log(f(['one', 'two', 'three']))
