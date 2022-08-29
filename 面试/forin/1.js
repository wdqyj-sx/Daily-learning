// const arr = [1,2,3,4]

// for(let key in arr){
//     console.log(key)
// }
// for(let value of arr){
//     console.log(value)
// }

// const object = { name :'lx',age:23}
// object[Symbol.iterator] = function(){
//     const keys = Object.keys(object)
//     let index = 0
//     let that = this
//     return {
//         next(){
//             if(keys.length === 0 || index>=keys.length){
//                 return {
//                     value:undefined,
//                     done:true
//                 }
//             }
//             else {
//                 const key = keys[index++]
//                 let value = [key,that[key]]
//                 return {
//                     value,
//                     done:false
//                 }
//             }
//         }
//     }
// }
// for(let key in object){
//     console.log(key) // name age
// }

// for(let value of object){
//     console.log(value) //报错
// }

const list = [{ name: 'lx' }, { age: 23 }]
for (const val of list) {
    console.log(val) // 输出{ name: 'lx' }, { age: 23 }
    for (const key in val) {
        console.log(val[key]) // 输出 lx,23
    }
}