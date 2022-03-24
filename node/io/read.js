const fs = require("fs")
const buf = Buffer.alloc(30) //分配30个字节空间

fs.open("./test1.txt",(err,fd)=>{
    // fd表示从文件读取内容，默认数字从3开始
    if(err){
        throw err
    }
    // 从fd读，然后写入buf，从第三个位置开始写，写九个位置，最后一个3表示从fd的第三个位置开始读
    // vscode utf-8中汉字占三个字节
    fs.read(fd,buf,3,9,3,(err,file)=>{
        // 原文：繁华声遁入空门
        // 读入：华声遁
        console.log(buf.toString())
    })
})

fs.open("./test3.txt","w",(err,fd)=>{
    // 从buf的第三个位置开始读，读三个位置，从文件的第0个位置开始写入
    fs.write(fd,buf,3,3,0,(err,wfile)=>{
        console.log(buf.toString())
        // 写入:华
    })
})