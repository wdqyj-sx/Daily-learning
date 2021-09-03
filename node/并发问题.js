const fs = require('fs')

function after(timer, callback) {
  let _arr = []
  return (data, index) => {
    _arr[index] = data
    if (--timer == 0) {
      callback(_arr)
    }
  }
}
let out = after(2, (arr) => {
  console.log(arr)
})

fs.readFile('./a.txt', 'UTF8', (err, data) => {
  out(data, 0)
})

fs.readFile('./b.txt', 'UTF8', (err, data) => {
  out(data, 1)
})
