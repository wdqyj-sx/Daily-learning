const fs = require('fs')

const events = {
  _events: [],
  on: function (fn) {
    this._events.push(fn)
  },
  emit: function (data) {
    this._events.forEach((fn) => fn(data))
  },
}

let arr = []
//订阅
events.on((data) => {
  arr.push(data)
  if (arr.length >= 2) {
    console.log(...arr)
  }
})

fs.readFile('./a.txt', 'UTF8', (err, data) => {
  //发布
  events.emit(data)
})

fs.readFile('./b.txt', 'UTF8', (err, data) => {
  //发布
  events.emit(data)
})
