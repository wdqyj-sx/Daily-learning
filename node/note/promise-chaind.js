//声明三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new Error('错误'))
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 如果x是promise,但是是其个人定义的promise,为了确保其符合规范，加一个防护措施，确保其状态改变之后不会再次改变
    let called = false
    // 这里要try一下，因为即使x有then,也不一定能拿到,如defineProperty定义，可能会设置限制，取值会报错
    try {
      let then = x.then
      //这里可以认为它是promise了
      if (typeof then === 'function') {
        //执行，不宜采用x.then(),因为x内部可以设置getter进行阻止
        then.call(
          x,
          (y) => {
            //这里的y为新的promise的resolve存储的值,r为reject存储的值
            //继续递归，直到y 为一个常量
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        //这里说明x为普通值
        if (called) return
        called = true
        reject(x)
      }
    } catch (e) {
      reject(e)
    }
  } else {
    //说明其为普通值
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    //初始化状态
    this.state = PENDING
    this.value = undefined
    this.reason = undefined
    this.resolveCallback = []
    this.rejectCallback = []

    const resolve = (value) => {
      if (this.state == PENDING) {
        this.value = value
        this.state = FULFILLED
        this.resolveCallback.forEach((fn) => fn())
      }
    }
    const reject = (reason) => {
      if (this.state == PENDING) {
        this.reason = reason
        this.state = REJECTED
        this.resolveCallback.forEach((fn) => fn())
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
    let promise2 = new Promise((resolve, reject) => {
      if (this.state == FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            resolve(e)
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

module.exports = Promise
