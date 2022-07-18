// let arr = ['1','2','3']
// function unary (fn){
//     return fn.length ===1? fn:(arg)=>fn(arg)
// }
// console.log(arr.map(unary(parseInt)))
// console.log(parseInt('3',3))

let factorial = (n)=>{
    if(n===0){
        return 1
    }
    return n * factorial(n-1)
}

const memoized = (fn)=>{
    const lookupTable = {}
    return (arg)=>lookupTable[arg] || (lookupTable[arg] = fn(arg))
}

console.log(memoized(factorial)(10))