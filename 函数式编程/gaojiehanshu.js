// function forEach (arr, fn) {
//     for (let i = 0; i < arr.length; ++i) {
//         fn(arr[i])
//     }
// }

// forEach([1, 2, 3], (item) => {
//     console.log(item)
// })

// function filter (arr, fn) {
//     let result = [];
//     for (let i = 0; i < arr.length; ++i) {
//         if (fn(arr[i])) {
//             result.push(arr[i])
//         }
//     }
//     return result
// }

// let results = filter([1, 2, 3], (item) => {
//     return item > 2
// })
// console.log(results)

// function map (arr, fn) {
//     let results = []
//     for (value of arr) {
//         results.push(fn(value))
//     }
//     return results
// }

// let results = map([1, 2, 3], (item) => item * 2)
// console.log(results)

// function every (arr, fn) {
//     let flag = true
//     for (const value of arr) {
//         flag = fn(value)
//         if (!flag) {
//             break;
//         }
//     }
//     return flag
// }

// console.log(every([1, 2, 3], (item) => item > 2))

// function some (arr, fn) {
//     let results = false
//     for (const value of arr) {
//         results = fn(value)
//         if (results) {
//             break
//         }
//     }
//     return results
// }

// console.log(some([1, 2, 3], (item) => item > 2))
// function once (fn) {
//     let done = false
//     return function () {
//         if (!done) {
//             done = true
//             return fn.apply(this, arguments)
//         }
//     }

// }

// let pay = once(function (money) {
//     console.log(`付款${money}元`)
// })
// pay(5)
// pay(5)
// pay(5)
