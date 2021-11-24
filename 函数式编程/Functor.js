//一个容器，包含一个值
class Container{
    // of静态方法，可以省略new关键字创建对象
    static of(value){
        return new Container(value)
    }

    constructor(value){
        this._value = value
    }
//传入变形关系，将容器里的每一个值映射到另一个容器
    map(fn){
        return Container.of(fn(this._value))
    }
}

//测试
let ans = Container.of(5)
    .map(x=>x+1)
    .map(x=>x+2)
    console.log(ans)