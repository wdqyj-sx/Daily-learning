const Promise = require('./source/promise1')

let promise = new Promise((resolve, reject) => {
  console.log('promise')
  throw new Error('err')
  resolve('value')
})

promise.then(
  () => {
    console.log('success', value)
  },
  (reason) => {
    console.log('err', reason)
  }
)
