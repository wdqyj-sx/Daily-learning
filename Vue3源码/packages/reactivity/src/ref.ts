import { isObject } from "@vue/shared";
import { reactive } from "./reactive";
import { activeEffect, trackEffects, triggerEffects } from "./effect";

export function ref(value){
    return new RefImpl(value);
}

export function proxyRefs(object){
    return new Proxy(object,{
        get(target,key,receiver){
            let r = Reflect.get(target,key,receiver)
            return r.__v_isRef?r.value:r
        },
        set(target,key,value,receiver){
            if(target[key].__v_isRef ){
                target[key].value = value
                return true
            }
            return Reflect.set(target,key,value,receiver)
        }
    })
}
export function toRef(object,key){
    return new ObjectRefImpl(object,key)
}

export function toRefs(object){
    let result = {}
    for(let key in object){
        result[key] = toRef(object,key)
    }
    return result
}

class ObjectRefImpl{
    private __v_isRef = true;
    private _value = null;
    constructor(public object,public key){
    }
    get value(){
        return this.object[this.key]
    }
    set value(newValue){
        this.object[this.key] = newValue
    }
}
class RefImpl {
    private _value = null;
    private __v_isRef = true;
    private dep = null;
    constructor(public rawValue){
        this._value = toReactive(rawValue) 
    }
    get value(){
        if(activeEffect){
            trackEffects(this.dep ||(this.dep = new Set()))
        }
        return this._value
    }
   set value(newValue){
        if(newValue !== this.rawValue){
            this._value = toReactive(newValue)
            this.rawValue = newValue
            triggerEffects(this.dep)
        }
   }
}


export function toReactive(value){
    return isObject(value) ? reactive(value):value
}
