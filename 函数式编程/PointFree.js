//非point free模式

// Hello World => hello_world
const fp = require('lodash/fp')

function f(word){
    return word.toLowerCase().replace(/\s+/g,'_')
}
console.log(f('Hello World'))

const f2 = fp.flowRight(fp.replace(/\s+/g,'_'),fp.toLower)
console.log(f2('Hello World'))