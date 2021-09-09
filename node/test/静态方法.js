Promise.resolve(1).then(
  (value) => {
    console.log(value)
  },
  (reason) => {
    console.log(reason)
  }
)

Promise.resolve('err').then(
  (value) => {
    console.log(value) //1
  },
  (reason) => {
    console.log(reason) //err
  }
)
