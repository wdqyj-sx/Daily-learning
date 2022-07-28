import { isNumber, isString } from "@vue/shared"
import {isSameVNode,Text,ShapeFlags, createVNode} from "./createVNode"

export function createRenderer(options){
    let {
        createElement:hostCreateElement,
        createTextNode: hostCreateTextNode,
        insert: hostInsert,
        remove: hostRemove,
        querySelector: hostQuerySelector,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        setText: hostSetText,
        setElementText: hostSetElementText,
        patchProp: hostPatchProp
    } = options

    function patchProps(oldProps,newProps,el){
        if(oldProps == null){
            oldProps = {}
        }
        if(newProps == null){
            newProps = {}
        }
        for(let key in newProps){
            hostPatchProp(el,key,oldProps[key],newProps[key])
        }
        for(let key in oldProps){
            if(newProps[key] == null){
                hostPatchProp(el,key,oldProps[key],null)
            }
        }
    }
    function umount(vnode){
        hostRemove(vnode.el)
    }
    function patch(n1,n2,container,anchor = null){
        //判断n1和n2是否相同
        if(n1 && !isSameVNode(n1,n2)){
            //之前存在节点，但和更新的不同，则删除之前的节点
            umount(n1)
            n1 = null
        }
        const {type,shapeFlags} = n2
        switch(type){
            case Text:
                processText(n1,n2,container)
                break
            default:
                if(shapeFlags & ShapeFlags.ELEMENT){
                    
                    processElement(n1,n2,container,anchor)
                }
        }
    }
    function render(vnode,container){
        if(vnode == null){
            //卸载元素
            if(container._vnode){
                umount(container._vnode)
            }
        }else {
            
            //更新元素
            patch(container._vnode || null,vnode,container)
        }
        //将节点保留在容器上
        container._vnode = vnode
    }
    return {
        render
    }

    function normalize(children,i){
        if(isString(children[i]) || isNumber(children[i]) ){
            children[i] = createVNode(Text,null,children[i])
        }
        return children[i]
    }

    function mountChildren(children,container){
        for(let i = 0;i<children.length;++i){
            //如果数组为字符串或者数字，则是文本节点数组，其它的则是元素节点数组
          let child = normalize(children,i)
          patch(null,child,container)
        }
    }
    function unmountChildren(children){
        children.forEach(child =>{
            umount(child)
        })
    }
    function patchChildren(n1,n2,el){
        let c1 = n1.children
        let c2 = n2.children
        const prevShapeFlag = n1.shapeFlags
        const shapeFlag = n2.shapeFlags
        //如果新孩子是文本
        if(shapeFlag && shapeFlag & ShapeFlags.TEXT_CHILDREN){
            //之前是数组
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                
                unmountChildren(c1)
            }if(c1!==c2){
                //之前要么文本，要么是空
                hostSetElementText(el,c2)
            }
        }else {
            //最新的要么是数组，要么就是空
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                //前后都是数组.
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    //diff算法
                    patchKeyedChildren(c1,c2,el)
                }else {
                    //说明是空
                    unmountChildren(c1)
                }
            }else {
                if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
                    hostSetElementText(el,'')
                }
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
                    mountChildren(c2,el)
                }
            }
        }
    }
    function mountElement(vnode,container,anchor){
        
        let {type,shapeFlags,props,children} = vnode
        let el = vnode.el = hostCreateElement(type)
        if(props){
            //存在属性则更新属性
            patchProps(null,props,el)
        }
        //此时渲染children,其不是文本就是数组
        if(shapeFlags & ShapeFlags.TEXT_CHILDREN){
            hostSetElementText(el,children)
        }
        if(shapeFlags & ShapeFlags.ARRAY_CHILDREN){
            mountChildren(children,el)
        }
        hostInsert(el,container,anchor)

    }
    function patchElemengt(n1,n2){
       
        //说明n1,n2能复用
        let el = n2.el = n1.el
        let oldProps = n1.props
        let newProps = n2.props
        //比较属性是否相同
        patchProps(oldProps,newProps,el)
        //比较孩子是否相同
        patchChildren(n1,n2,el)
    }
    function processText(n1: any, n2: any, container: any) {
        if(n1 == null){
            hostInsert(n2.el = hostCreateTextNode(n2.children),container)
       }else {
        //复用老的节点
            const el = n2.el = n1.el
            let newText = n2.children
            if(newText !== n1.children){
                hostSetText(newText)
            }
       }
    }
    function processElement(n1: any, n2: any, container: any, anchor: any) {
        if(n1 == null){
            //创建节点
            mountElement(n2,container,anchor)
        }else {
            //更新节点
            
            patchElemengt(n1,n2)
        }
    }
    
}


function patchKeyedChildren(c1: any, c2: any, el: any) {
//    比较c1和c2的差异，尽量复用之前的节点

}

