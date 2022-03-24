const fs = require("fs")
// 创建可读流
const rs = fs.createReadStream('test1.txt')
const ws = fs.createWriteStream("test4.txt")
// 开始监听文件的操作
rs.on('open',(fd)=>{
    console.log(fd)
})
let arr = []
rs.on('data',(chunk)=>{
    //从内存中拿数据的时候执行此操作
    arr.push(chunk)
})

// 结束时触发
rs.on("end",()=>{
    console.log(Buffer.concat(arr).toString())
    ws.write(Buffer.concat(arr))
})