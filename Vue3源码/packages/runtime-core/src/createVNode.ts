import {isArray,isString} from "@vue/shared"

//创建类型标识
export const Text = Symbol("Text")
export const Fragment = Symbol('Fragment')
export function isVnode(val){
    return !!val.__v_isVNode
}

//判断是否为同一类型节点
export function isSameVNode(n1,n2){
    return n1.type=== n2.type && n1.key === n2.key
}
//标记节点类型
export const enum ShapeFlags { // vue3提供的形状标识
    ELEMENT = 1, // 1
    FUNCTIONAL_COMPONENT = 1 << 1, // 2
    STATEFUL_COMPONENT = 1 << 2, // 4
    TEXT_CHILDREN = 1 << 3, // 8
    ARRAY_CHILDREN = 1 << 4, // 16
    SLOTS_CHILDREN = 1 << 5, // 32
    TELEPORT = 1 << 6, // 64 
    SUSPENSE = 1 << 7, // 128
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEPT_ALIVE = 1 << 9,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}


export function createVNode(type,props = null,children = null){
    //创建虚拟节点
    let shapeFlags = isString(type)? ShapeFlags.ELEMENT:0
    const vnode = {
        __v_isVNode:true,
        type,
        props,
        children,
        key: props&&props.key,
        el:null,
        shapeFlags
    }
    //判断children是否为数组
    if(children){
        let temp = 0
        if(isArray(children)){
            temp = ShapeFlags.ARRAY_CHILDREN
        }else {
            //将字符串处理成对象
            children = String(children)
            temp = ShapeFlags.TEXT_CHILDREN
        }
        vnode.shapeFlags = vnode.shapeFlags|temp
    }
    return vnode
}

