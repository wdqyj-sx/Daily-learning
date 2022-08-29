import { reactive } from "@vue/reactivity"
import { hasOwn, isFunction } from "@vue/shared"

export function createComponentInstance(vnode){
    let instance = {
        data:null, //组件本身的数据
        vnode,
        subTree:null,//组件对应的渲染的虚拟节点
        isMounted:false,//组件是否 挂在过
        update:null,//组件的effect.run方法
        render:null,
        //组件内部定义的属性参数
        propsOption:vnode.type.props ||{},
        props:{},//组件传入的属性参数
        attrs:{},//用户没有接收的参数
        proxy:null//代理对象
    }
    return instance
}
function initProps(instance,rawProps){
    const props = {}
    const attrs = {}
    const options = instance.propsOption
    //让用户传入的数据分给props和attrs
    if(rawProps){
        for(let key in rawProps){
            let value = rawProps[key]
            if(key in options){
                props[key] = value
            }else {
                attrs[key] = value
            }
        }
    }
    //检测props数据
    instance.props = reactive(props)
    instance.attrs = attrs
}
const publicProperties = {
    $attrs:(instance)=>instance.attrs
}

//做代理
const instanceProxy = {
    get(target,key){
        const { data,props} = target
        if(data && hasOwn(data,key)){
            return data[key]
        }else if(props && hasOwn(props,key)){
            return props[key]
        }
        let getter = publicProperties[key]
        if(getter){
            return getter(target)
        }
    },
    set(target,key,value,receiver){
        // debugger
        const {data,props} = target
        if(data && hasOwn(data,key)){
            data[key] = value
        }else if(props && hasOwn(props,key)){
            console.warn('props not update');
            return false
        }
        return true
    }
}
export function setupComponent(instance){

    let { type,props,children}  = instance.vnode
    let {data,render} = type
    //初始化属性
    initProps(instance,props);
    instance.proxy = new Proxy(instance,instanceProxy);
    if(data){
        if(!isFunction(data)){
            return console.warn('The data option must be a function.')
        }
        //给实例赋予data属性
        instance.data = reactive(data.call({}))
    }
    instance.render = render
}