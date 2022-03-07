// const fs = require('fs')
// const { Transform } = require("stream")

// //导出一个默认任务
// exports.default = ()=>{
//     //文件读取流
//     const read = fs.createReadStream("./css/index.css")
//     //创建文件写入流
//     const write = fs.createWriteStream("./css/index.min.css")
//     //创建文件转换流
//     const transform = new Transform({
//         transform:(chunk,encoding,callback)=>{
//             //核心转换过程
//             //chunk读取流中的内容，buffer格式
//             const input = chunk.toString()
//             // 去除空格和注释
//             const output = input.replace(/\s+/g,'').replace(/\/\*.+?\*\//g,'')
//             //回调，错误优先
//             callback(null,output)
//         }
//     })
//     //把读取出来的文件流导入到写入流
//     read
//         .pipe(transform)
//         .pipe(write)
//         //返回写入结果，标识任务结束
//     return read;
// }

const {src,dest} = require("gulp")
const cleanCss = require("gulp-clean-css")
const rename = require("gulp-rename")

exports.default =()=>{
    //读入css下所有css文件
    return src("css/*.css")
    .pipe(cleanCss())
    .pipe(rename({extname:'.min.css'}))
    //写入到dist文件夹下
    .pipe(dest('dist'))
}