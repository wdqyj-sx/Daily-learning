let arr = [1,2,[3,4,5,[6,7,8,9],10],[11,12],13]
// function fn(arr){
//     let arr1 = []
//     arr.forEach(val=>{
//         if(val instanceof Array){
//             arr1 = arr1.concat(fn(val))
//         }else {
//             arr1.push(val)
//         }
//     })
//     return arr1
// }
// console.log(fn(arr).length)

function fn(arr){
    return arr.reduce((pre,cur)=>{
        return pre.concat(Array.isArray(cur)?fn(cur):cur)
    },[])
}
console.log(fn(arr))