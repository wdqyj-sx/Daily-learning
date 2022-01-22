//只能被继承，不能实例化
export {}

abstract class Animal {
    eat(food:string):void{
        console.log(food)
    }
    abstract run(distance:number):void
}

class Dog extends Animal {
    run(distance:number):void {
        console.log(distance)
    }
}

const d = new Dog()