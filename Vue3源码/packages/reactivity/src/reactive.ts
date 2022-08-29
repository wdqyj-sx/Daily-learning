import {isObject} from "@vue/shared"
import {ReactiveFlags,baseHandler} from "./baseHandler"

const reactiveMap = new WeakMap()

export function reactive(target){
    //传入的值需要是一个对象，如果不是，则不需要进行绑定
    if(!isObject(target)){
        return target
    }
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }
    const existing = reactiveMap.get(target)
    if(existing){
        return existing
    }
    
    //实现最初的proxy
    const proxy = new Proxy(target,baseHandler)
    reactiveMap.set(target,proxy)
    return proxy
}

