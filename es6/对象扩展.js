let obj1 = {
    a:123,
    b:456
}
let obj2 = {
    a:456,
    c:789
}

let result = Object.assign(obj2,obj1)
console.log(result)   //{ a: 123, c: 789, b: 456 }
console.log(result === obj2)  //true