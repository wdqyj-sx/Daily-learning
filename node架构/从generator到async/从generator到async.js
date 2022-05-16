// const { values } = require("lodash")

const { wrap } = require("module");

// let likeArray = {
//     0:0,
//     1:1,
//     2:2,
//     3:3,
//     length:4,
//     get [Symbol.toStringTag](){
//         return 'MyArray'
//     },
//     [Symbol.iterator]:function(){
//         let index = 0
//         return {
//             next:()=>{
//                 return {
//                     value:this[index],done:index++==this.length
//                 } 
//             }
//         }
//     }
// }

// let arr = [...likeArray] //不报错
// console.log(arr)
// console.log(likeArray.toString())

// function* read(){
//     yield 'vue';
//     yield 'vite';
//     yield 'node'
// }

// let it = read()
// console.log(it.next())  //{ value: 'vue', done: false }
// [Symbol.iterator]:function*(){
//     let index = 0
//     let len = this.length
//     while(index!==len){
//         yield this[index++]
//     }
// }
// function* read(){
//     let a = yield 'vue'
//     console.log(a) //11
//     let b = yield 'vite'
//     console.log(b) //1111
//     let c = yield 'node'
//     console.log(c) //11111
// }

// let it = read()
// console.log(it.next('1'))
// console.log(it.next('11'))
// console.log(it.next('1111'))
// console.log(it.next('11111'))
// const fs = require("fs").promises
// const path = require("path")
// function* read(){
//     let name = yield fs.readFile(path.resolve(__dirname,'name.txt'),'utf-8')
//     let age = yield fs.readFile(path.resolve(__dirname,name),'utf-8')
//     return age
// }
// let it = read()
// let {value,done} = it.next()
// if(!done){
//     value.then(data=>{
//         let {value,done} = it.next(data)
//         if(!done){
//             value.then(data=>{
//                 let {value,done} = it.next(data)
//                 if(done){
//                     console.log(value)
//                 }
//             })
//         }
//     })
// }
// function co(it){
//    return new Promise((resolve,reject)=>{
//        function next(val){
//             let {value,done} = it.next(val)
//             if(!done){
//                 value.then((data)=>{
//                     next(data)
//                 },(err)=>{
//                     reject(err)
//                 })
//             }
//             else {
//                 resolve(value)
//             }
//        }
//        next()
//    })
   
// }

// co(read()).then(data=>console.log(data))
// const regeneratorRuntime = {
//     mark(fn){
//         return fn
//     },
//     wrap(iteratorFn){
//         const _context = {
//             next:0,
//             sent:null,
//             done:false,
//             stop(){
//                 _context.done=true
//             }

//         }
//        return  {
//          next(val){
//             _context.sent =val
//             return {
//                 value:iteratorFn(_context),
//                 done:_context.done
//             }
//        }
//        }
//     }
// }


// var _marked = /*#__PURE__*/regeneratorRuntime.mark(read);

// function read() {
//     var a, b, c;
//     return regeneratorRuntime.wrap(function read$(_context) {
//         while (1) { // while(true) 表示这个东西是一个状态机，根据状态的变化实现对应的逻辑， 这个逻辑会走多次
//             switch (_context.prev = _context.next) {
//                 case 0:
//                     _context.next = 2;
//                     return 'vue';

//                 case 2:
//                     a = _context.sent;
//                     console.log(a, 'a');
//                     _context.next = 6;
//                     return 'vite';

//                 case 6:
//                     b = _context.sent;
//                     console.log(b, 'b');
//                     _context.next = 10;
//                     return 'node';

//                 case 10:
//                     c = _context.sent;
//                     console.log(c, 'c');

//                 case 12:
//                 case "end":
//                     return _context.stop();
//             }
//         }
//     }, _marked);
// }

// let it = read()
// console.log(it.next());
// console.log(it.next('aaa'));
// console.log(it.next('bbb'));
// console.log(it.next('ccc'));

const fs = require("fs").promises
const path = require("path")

async function read(){
    let name = await  fs.readFile(path.resolve(__dirname,'name.txt'),'utf-8')
    let age = await  fs.readFile(path.resolve(__dirname,name),'utf-8')
    return age
}

read().then(data=>{
    console.log(data)
})