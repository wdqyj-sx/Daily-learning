//声明三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class Promise {
  constructor(executor) {
    //初始化状态
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    const resolve = (value) => {
      if (this.state == PENDING) {
        this.value = value
        this.state = FULFILLED
      }
    }
    const reject = (reason) => {
      if (this.state == PENDING) {
        this.reason = reason
        this.state = REJECTED
      }
    }
    //执行执行器
    try {
      executor(resolve, reject)
    } catch (e) {
      //出错直接走失败状态
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    if (this.state == FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.state == REJECTED) {
      onRejected(this.reason)
    }
  }
}

module.exports = Promise
