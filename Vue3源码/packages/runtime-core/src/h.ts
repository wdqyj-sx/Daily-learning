import {isObject,isFunction} from "@vue/shared"
import { createVNode, isVnode } from "./createVNode"

export function h(type,propsOrChildren,children){
     const l = arguments.length
     if(l == 2){
        //需要判断第二个参数是属性还是孩子
        if(isObject(propsOrChildren)&&!isFunction(propsOrChildren)){
            //可能是属性对象或者元素对象
            if(isVnode(propsOrChildren)){
                //是对象属性
             return   createVNode(type,null,[propsOrChildren])
            }
            else {
               return createVNode(type,propsOrChildren)
            }
        }
     }else {
        if(l===3 && isVnode(children)){
            //孩子是虚拟节点
        return   createVNode(type,propsOrChildren,[children])
        }else if(l>3){
            children = Array.from(arguments).slice(2)
        }
        return createVNode(type,propsOrChildren,children)
     }
}