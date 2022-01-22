const _ = require("lodash")

//柯里化并置换参数，要求先接受分隔符，再接收数据
let split = _.curry((sep,str)=> _.split(str,sep))
let map = _.curry((fn,arr)=> _.map(arr,fn))
let join = _.curry((str,arr)=> _.join(arr,str))
let check = function(value){
    console.log(value)
    return value
}
const f = _.flowRight(join('-'),map(_.toUpper),split(" "))
console.log(f('hello world'))

