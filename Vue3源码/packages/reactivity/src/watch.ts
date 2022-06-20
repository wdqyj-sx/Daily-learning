import { isFunction, isObject } from "@vue/shared";
import { isReactive } from "./baseHandler";
import { ReactiveEffect } from "./effect";

function traversal(value,set = new Set()){
    if(!isObject(value)){
        return value
    }
    if(set.has(value)){
        return value
    }
    set.add(value)
    for(let key in value){
        traversal(value[key],set)
    }
    return value
}
export function watch(source,cb){
    let get = null;
    let cleanUp = null;
    let oldValue = null;
    if(isReactive(source)){
        get = ()=>traversal(source)
    }else if(isFunction(source)){
        get = source
    }

    const onCleanUp = (fn)=>{
        this.cleanUp = fn
    }

    let job = () => {
        cleanUp && cleanUp()
        let  newValue = effect.run
        cb(oldValue,newValue,onCleanUp)
        oldValue = newValue
    }
    let effect = new ReactiveEffect(get,job)
    oldValue = effect.run()
}