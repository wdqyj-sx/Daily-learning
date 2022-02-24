//方式一

function fib(num:number):number {
    if(num<=1)
        return num
    return fib(num-1) +fib(num-2)
}
console.time()
console.log(fib(10))
console.timeEnd()
// 方式二

function fib2(num:number):number{
    if(num<=1)
        return num
    let first = 0
    let second = 1
    for(let i = 0;i<num-1;++i){
        let sum = first+second
        first = second
        second = sum
    }
    return second
}
console.time()
console.log(fib2(10))
console.timeEnd()