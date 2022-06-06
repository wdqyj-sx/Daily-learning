import {isObject} from "@vue/shared"

export function reactive(target){
    //传入的值需要是一个对象，如果不是，则不需要进行绑定
    if(!isObject(target)){
        return target
    }
    //实现最初的proxy
    const proxy = new Proxy(target,{
        get(target,key,receiver){
            console.log('这个属性被取到了')
            return Reflect.get(target,key,receiver)
        },
        set(target,key,value,receiver){
            console.log('这个属性改变了')
            target[key] = value;
            return Reflect.set(target,key,value,receiver)
        }
    })
    return proxy
}

