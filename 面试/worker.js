// worker.js
const set = new Set()
onconnect = event => {
  const port = event.ports[0]
  set.add(port)
 
 
  // 接收信息
  port.onmessage = e => {
    // 广播信息
    set.forEach(p => {
      p.postMessage(e.data)
    })
  }
 
 
  // 发送信息
  port.postMessage("worker广播信息")
}
