//可以自动去重
const queue = new Set()
let isFlushing = false
const resolvePromise = Promise.resolve()
export function queueJob(job){
    queue.add(job)
    if(!isFlushing){
      isFlushing = true //阻拦后面的调用
      resolvePromise.then(()=>{
        try{
          queue.forEach(job =>job())
        }finally{
          isFlushing = false
          queue.clear()
        }
      })
    }
}