const Promise = require("./Promise")

const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('sx')
    }, 0);
})

p.then((value) => {
    console.log(value)
}, (reason) => {
    console.log(reason)
})