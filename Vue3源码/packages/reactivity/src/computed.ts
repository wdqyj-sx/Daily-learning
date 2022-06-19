import { isFunction } from "@vue/shared"
import { activeEffect, trackEffects, triggerEffects,ReactiveEffect } from "./effect";

export function computed(getterOrOptions){
    let getter = null;
    let setter = null;
    let fn = ()=>{
        throw new Error("this function is onlyRead");
        
    }
    let isGetter = isFunction(getterOrOptions)
    if(isGetter){
        getter = getterOrOptions
        setter = fn
    }
    else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set || fn
    }

    return new computedRefImpl(getter,setter)
}

class computedRefImpl{
    private _value = null
    private _dirty = true
    public effect = null
    public deps = null
    constructor(getter,public setter){
        this.effect = new ReactiveEffect(getter,()=>{
            if(!this._dirty){
                this._dirty = true
                triggerEffects(this.deps)
            }
        })
    }
    get value(){
        debugger
        if(activeEffect){
            // 存在effect，则进行依赖收集
            trackEffects(this.deps ||  (this.deps = new Set()) )
        }
        if(this._dirty){
            this._dirty = false
            this._value = this.effect.run()
        }
        return this._value
    }
    set value(newValue){
        this.setter(newValue)
    }
}