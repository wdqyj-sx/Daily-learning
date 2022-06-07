
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}


export const baseHandler = {
    get(target,key,receiver){
        if(key === ReactiveFlags.IS_REACTIVE){
            return true
        }
        console.log('这个属性被取到了')
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log('这个属性改变了')
        target[key] = value;
        return Reflect.set(target,key,value,receiver)
    }
}