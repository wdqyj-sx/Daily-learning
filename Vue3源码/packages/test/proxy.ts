let person = {
    name:'sx',
    get age(){
        return this.name
    }
}
const proxy = new Proxy(person,{
    get(target,key,receiver){
        console.log('这个属性被取到了')
        console.log(key)
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log('这个属性改变了')
        target[key] = value;
        return Reflect.set(target,key,value,receiver)
    }
})


proxy.age
