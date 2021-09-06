// // const Promise = require('./source/promise1')
// const Promise = require('./source/promise2')

// let promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log('sx')
//     resolve('hah')
//   }, 1000)
// })

// promise.then(
//   (value) => {
//     console.log('success', value)
//   },
//   (reason) => {
//     console.log('err')
//   }
// )

// promise.then(
//   () => {
//     console.log('success2')
//   },
//   (reason) => {
//     console.log('err2')
//   }
// )
const Promise = require('./source/promise3')
const fs = require('fs')
// const Promise = require('./source/promise1')

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

readFile('./source/a.txt')
  .then(
    (value) => {
      return readFile(value)
    },
    (reason) => {
      console.log(reason)
    }
  )
  .then(
    (value) => {
      console.log(value)
    },
    (reason) => {
      console.log(reason)
    }
  )
