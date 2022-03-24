const fs = require("fs")

fs.readFile('./test1.txt',(err,obj)=>{
    if(err)
        throw err
    console.log(obj.toString())
    fs.writeFile('./test2.txt',obj,(err,mes)=>{
        if(err)
            throw err
        console.log(mes)

    })
})