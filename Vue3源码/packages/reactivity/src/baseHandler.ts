import { triggerRef } from "vue"
import { track,trigger } from "./effect"

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
export {track} from "./effect"

export const baseHandler = {
    get(target,key,receiver){
        if(key === ReactiveFlags.IS_REACTIVE){
            return true
        }
       track(target,key)
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
       let oldValue = target[key]
       if(oldValue!== value){
        
        let result  = Reflect.set(target,key,value,receiver)
        //对数据进行更新
        trigger(target,key,value)
        return result
       }
       
    }
}