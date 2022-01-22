// const _ = require('lodash')

function getArea (r) {
    console.log('sx')
    return Math.PI * r * r;
}

// let getAreawithMemory = _.memoize(getArea)

function memoize (f) {
    let cache = {}
    return function () {
        let arg_str = JSON.stringify(arguments)
        cache[arg_str] = cache[arg_str] || f.apply(f, arguments)
        return cache[arg_str]
    }

}
let getAreawithMemory = memoize(getArea)
console.log(getAreawithMemory(4))
console.log(getAreawithMemory(4))
console.log(getAreawithMemory(4))
