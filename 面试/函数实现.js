let arr = [1,2,3]

// // Array.prototype.myforEach=function(fn){
// //     for(let i = 0;i<this.length;++i){
// //         fn(this[i],i)
// //     }
// // }
// // arr.myforEach((item)=>{
// //     console.log(item)
// // })

// Object.prototype.myforEachObject = function(fn){
//     for(key in this){
//         if(this.hasOwnProperty(key)){
//             fn(key,this[key])
//         }
//     }
// }

// let obj = {
//     name:'sx',
//     aeg:18
// }

// obj.myforEachObject((key,value)=>{
//     console.log(key,value)
// })

Array.prototype.myevery = function(fn){
    let result = true
    for(let i = 0;i<this.length;++i){
        result = result && fn(this[i],i)
        if(!result) return result
    }
    return result
}
let result = arr.every((item)=>{
    return item>2
})
console.log(result)