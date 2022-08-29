class Animal {
    readonly name:string
    constructor(name:string){
        this.name = name
    }
    protected run(){
        console.log('run')
    }
    private sing(){
        console.log('sing')
    }
}

let snake = new Animal('snake')
snake.run()
snake.sing()

class Dog extends Animal{
    constructor(name:string){
        super(name)
    }
    bark(){
        console.log('bark')
        super.run()
        super.sing()
    }
}

let wangcai = new Dog('wangcai')
wangcai.bark()
