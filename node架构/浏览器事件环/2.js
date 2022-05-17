// // async function async () {
// //     console.log(2);
// //     await console.log(3);
// //     console.log(4)
// // }

// const { reject } = require("lodash");
// const { resolve } = require("path");

// // function* read(){
// //     console.log(2)
// //     yield console.log(3)
// //     console.log(4)
// // }

// // let it = read()

// // async2 = function(){
// //     return new Promise((resolve,reject)=>{
// //         let { value,done} = it.next()
// //         if(!done){
// //             Promise.resolve(value).then(data=>{

// //             })
// //         }
// //     })
// // }

// new Promise((resolve,reject)=>{
//     resolve(11)
// }).then(data=>{
//     console.log(data)
//     return new Promise((resolve,reject)=>{
//         resolve(22)
//     })
// // }).then(data=>{
//     console.log(data)
// })

// console.log('sx')
// setTimeout(() => {
//     console.log(33)
// }, 0);

function * read(){
    console.log(1)
    console.log(2)
    yield console.log(3)
    console.log(4)
}

let it = read()
it.next()