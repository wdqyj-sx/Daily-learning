export {}

class Person {
    public name:string
    private age:number
    protected gender:boolean
    constructor(name:string,age:number){
        this.name = name
        this.age = age
        this.gender = true
    }
    sayHi(){
        console.log(this.gender)
    }
}

const tom = new Person('tom',18)
// console.log(tom.age) //无法访问
// console.log(tom.gender) //无法访问

// private只允许在该类中访问
// protected只允许在该类和其子类中访问
//两者都不能在对象中访问

class Student extends Person{
    constructor(name:string,age:number){
        super(name,age)
        console.log(this.gender)
    }
}