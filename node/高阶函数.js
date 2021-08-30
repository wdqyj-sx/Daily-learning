function core(...args) {
  console.log('core', ...args)
}

Function.prototype.before = function (fn) {
  //剩余运算符，接收不确定的参数,转为数组
  return (...args) => {
    fn()
    this(...args) //拓展运算符,将数组分解转为参数
  }
}
function cb() {
  console.log('cb')
}

let newCore = core.before(cb)
newCore('a', 'b')
