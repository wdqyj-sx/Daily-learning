// new Promise((resolve, reject) => {
//   resolve(1)
// })
//   .then()
//   .then()
//   .then((value) => {
//     console.log(value) //1
//   })
//   .then(null, (err) => {
//     console.log

const Promise = require('../note/promise-static')

//   })
let p = Promise.resolve(1)

let s = Promise.all([1, 2, p])
s.then(
  (val) => {
    console.log(val)
  },
  (err) => {
    console.log(err)
  }
)
