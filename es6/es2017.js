// console.log(['he','o'].includes('o'))
let obj = {
    name:'sx',
    age:18,
    hobby:'song',
    get  fullname() {
        return this.name+" "+this.age
    }
}
console.log(Object.values(obj))  //[ 'sx', 18, 'song' ]
console.log(Object.entries(obj))  // [ [ 'name', 'sx' ], [ 'age', 18 ], [ 'hobby', 'song' ] ]
console.log(new Map(Object.entries(obj))) //{ 'name' => 'sx', 'age' => 18, 'hobby' => 'song' }
let obj2 = Object.assign({},obj)
obj2.name = 'cxy'
console.log(obj2.fullname) //sx 18
const obj3 = Object.getOwnPropertyDescriptors(obj)
console.log(obj3)  //获取对象全部信息
const obj4 = Object.defineProperties({},obj3)
obj4.name = 'cxy'
console.log(obj4.fullname) // cxy 18
for(const [key,value] of Object.entries(obj)){
    console.log(`${key.padEnd(16,'-')}和${value.toString().padStart(3,'-')}`)
    // name------------和-sx
    // age-------------和-18
    // hobby-----------和song
    // fullname--------和sx 18
}


