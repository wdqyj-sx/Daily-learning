// function isType(val, type) {
//   return Object.prototype.toString.call(val) == `[object ${type}]`
// }
// console.log(isType(123, 'Number'))
// console.log(isType('123', 'String'))

//柯里化之后可以减少用户对类型的输入

// function isType(type) {
//   return (val) => {
//     return Object.prototype.toString.call(val) == `[object ${type}]`
//   }
// }

// let isString = isType('String')
// console.log(isString('123'))
// console.log(isString(253))
// function sum(a, b, c, d) {
//   return a + b + c + d
// }
// console.log(sum.length)
//实现通用的柯里化函数：高阶函数
// function sum(a, b, c, d) {
//   return a + b + c + d
// }
// 利用通用柯里化函数实现类型判断
function curring(fn) {
  let inner = (arg = []) => {
    return arg.length >= fn.length
      ? fn(...arg)
      : (...newArg) => inner([...arg, ...newArg])
  }
  return inner()
}

function isType(type, val) {
  return Object.prototype.toString.call(val) == `[object ${type}]`
}

let util = {}
;['String', 'Number', 'Boolean', 'Null', 'Undefined'].forEach((type) => {
  util['is' + type] = curring(isType)(type)
})
console.log(util.isString('123'))
console.log(util.isNull('123'))
console.log(util.isNumber('123'))
