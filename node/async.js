// function* read () {
//     var a = yield 1;
//     console.log('1', a)
//     var b = yield 2;
//     console.log('2', b);
//     var c = yield 3;
//     console.log('3', c)

// }

// let it = read();
// it.next('sx');
// it.next('sx');
// it.next('sx');

// const regeneratorRuntime = {
//     mark (genFn) {
//         return genFn;
//     },
//     wrap (iteratorFn) {
//         // 初始化一个上下文
//         const context = {
//             //初始指针
//             next: 0,
//             done: false,//表示是否执行结束
//             stop () {
//                 this.done = true
//             }
//         }
//         it = {}
//         it.next = function (v) {
//             context.sent = v
//             let value = iteratorFn(context);
//             return {
//                 value,
//                 done: context.done
//             }
//         }
//         return it
//     }
// }

// "use strict";

// var _marked = /*#__PURE__*/regeneratorRuntime.mark(read);

// function read () {
//     var a, b, c;
//     return regeneratorRuntime.wrap(function read$ (_context) {
//         while (1) {
//             switch (_context.prev = _context.next) {
//                 case 0:
//                     _context.next = 2;
//                     return 1;

//                 case 2:
//                     a = _context.sent;
//                     console.log('1', a);
//                     _context.next = 6;
//                     return 2;

//                 case 6:
//                     b = _context.sent;
//                     console.log('2', b);
//                     _context.next = 10;
//                     return 3;

//                 case 10:
//                     c = _context.sent;
//                     console.log('3', c);

//                 case 12:
//                 case "end":
//                     return _context.stop();
//             }
//         }
//     }, _marked);
// }

// var it = read();
// let value, done;
// do {
//     let { value: v, done: d } = it.next(value);
//     value = v;
//     done = d;
// } while (!done)
// const { reject } = require("async")
const fs = require("fs")
// const { resolve } = require("path/posix")
const util = require("util")
// const { co } = require("co")
const readFile = util.promisify(fs.readFile)

async function read () {
    let data = await readFile("./source/a.txt", 'utf-8')
    let content = await readFile(data, 'utf-8')
    return content
}

let ans = read()
ans.then(data => {
    console.log(data)
})

// function co (it) {
//     return new Promise((resolve, reject) => {
//         function next (data) {
//             let { value, done } = it.next(data);
//             //如果执行结束，将结果存储
//             if (done) {
//                 resolve(value)
//             }
//             // 如果没有，递归调用
//             else {
//                 Promise.resolve(value).then(next, reject)
//             }
//         }
//         next()
//     })
// }

// function* read () {
//     let data = yield readFile('./source/a.txt', 'utf-8')
//     let content = yield readFile(data, 'utf-8')
//     return content
// }
// co(read()).then(data => {
//     console.log(data)
// }).catch(err => {
//     console.log(err)
// })

// let it = read();
// // 获取第一次读取文件的value 
// let { value } = it.next();
// //这里的value 是一个promise，我们要获取其值传给data
// value.then(data => {
//     let { value: v } = it.next(data)
//     //v为第二次读取文件的返回值
//     v.then(d => {
//         it.next(d)
//     })
// })