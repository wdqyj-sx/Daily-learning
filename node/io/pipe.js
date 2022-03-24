const fs = require("fs")
const rs = fs.createReadStream("test1.txt")
const ws = fs.createWriteStream("test5.txt")

rs.pipe(ws)