export let activeEffect = undefined

export class ReactiveEffect{
    public active = true
    public parent = null
    public deps = []
    constructor(public fn){
    }
    run(){
        //依赖收集，让属性和effect产生关联
        //如果没有激活，则不进行依赖收集
        if(!this.active){
            return this.fn()
        }else {
           try{
               //让activeEffect指向当前effect，
                this.parent = activeEffect
                activeEffect = this
                //触发react中的get或set
                return this.fn()
           }
           finally{
                activeEffect = this.parent
                this.parent = null;
           }
        }
    }

}

const targetMap = new WeakMap()
//进行依赖收集
export function track(target,key){
    //保证在effect中执行
    if(activeEffect){
        let depsMap = targetMap.get(target)
        if(!depsMap){
           targetMap.set(target,(depsMap = new Map()))
        }
        let deps = depsMap.get(key)
        if(!deps){
            depsMap.set(key,(deps = new Set()))
        }
        trackEffects(deps)
       
    }
}
export function trackEffects(deps){
   let shouldTrack = !deps.has(activeEffect)
   if(shouldTrack){
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
   }
    
}

export function trigger(target,key,value){
    let depsMap = targetMap.get(target)
    //该属性不依赖任何effect
    if(!depsMap){
        return 
    }
    let effects = depsMap.get(key)
    triggerEffects(effects)
}

export function triggerEffects(effects) {
   
    if(effects){
        effects.forEach(effcet =>{
            effcet.run()
        })
    }
}

export function effect(fn){
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}