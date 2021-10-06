const Promise = require("./Promise")
let p = new Promise((resolve, reject) => {
    resolve('a')
})
p.then((value) => {
    return value
}, (reason) => {
    return reason
}).then((value) => {
    console.log(value) //a
})
