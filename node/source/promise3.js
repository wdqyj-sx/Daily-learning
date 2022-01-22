const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise(promise2, x, resolve, reject) {
  //如果传入当前同一个类
  if (promise2 === x) {
    return reject(new Error('错误'))
  }
  // 如果传入一个promise，并且可能是别人写的promise
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // promise一旦改变状态，将不能再次改变，为了防止别人的Promise不遵守这个规范，这里设置一个限制
    let called = false
    // 不能确定then方法是否是通过defineProperty设置的，如果是，有可能加上限制导致无法取值
    try {
      let then = x.then
      //如果then是一个函数，这里就将他当promise处理
      if (typeof then === 'function') {
        //x.then的方式不太合适用，因为如果有getter可能会拦截
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            //传来的结果如果是一个promise，要获取它的最终值来传入下一个promise中的状态，
            //采用递归，获取它的最终值
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      }
      //如果不是函数，这里将他当普通值处理
      else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  }
  //按普通值处理
  else {
    resolve(x)
  }
}

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
        this.reason = reason
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
    let promise2 = new Promise((resolve, reject) => {
      if (this.state == FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state == REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.state == PENDING) {
        this.resolveCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.rejectCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
}

module.exports = promise
