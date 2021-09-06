const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class promise {
  constructor(executor) {
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.resolveCallback = []
    this.rejectCallback = []
    const resolve = (value) => {
      if (this.state == PENDING) {
        this.value = value
        this.state = FULFILLED
        //发布
        this.resolveCallback.forEach((fn) => fn())
      }
    }
    const reject = (reason) => {
      if (this.state == PENDING) {
        this.reason = this.reason
        this.state = REJECTED
        this.rejectCallback.forEach((fn) => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    //如果是等待态，就将操作存储，等待状态改变
    if (this.state == PENDING) {
      this.resolveCallback.push(() => {
        onFulfilled(this.value)
      })
      this.rejectCallback.push(() => {
        onRejected(this.reason)
      })
    }
    if (this.state == FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.state == REJECTED) {
      onRejected(this.reason)
    }
  }
}

module.exports = promise
