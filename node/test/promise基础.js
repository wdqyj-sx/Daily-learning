// const Promise = require('../note/Promise-async')
// const fs = require('fs')

// let p = new Promise((resolve, reject) => {
//   fs.readFile('./a.txt', 'utf8', (err, data) => {
//     if (err) return reject(err)
//     resolve(data)
//   })
// })
// p.then(
//   (value) => {
//     console.log(value) //sx
//   },
//   (reason) => {
//     console.log(reason)
//   }
// )
const Promise = require('../note/promise-chaind')
const fs = require('fs')

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

readFile('./a.txt')
  .then(
    (value) => {
      console.log(value) //./b.txt
      return readFile(value)
    },
    (reason) => {
      console.log(reason)
    }
  )
  .then(
    (value) => {
      console.log(value) //b
    },
    (reason) => {
      console.log(reason)
    }
  )
