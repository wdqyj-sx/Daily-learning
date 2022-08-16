import { isNumber, isString } from "@vue/shared"
import { isSameVNode, Text, ShapeFlags, createVNode, Fragment } from "./createVNode"
import { getSequence } from "./sequence"

export function createRenderer(options) {
    let {
        createElement: hostCreateElement,
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

    function patchProps(oldProps, newProps, el) {
        if (oldProps == null) {
            oldProps = {}
        }
        if (newProps == null) {
            newProps = {}
        }
        for (let key in newProps) {
            hostPatchProp(el, key, oldProps[key], newProps[key])
        }
        for (let key in oldProps) {
            if (newProps[key] == null) {
                hostPatchProp(el, key, oldProps[key], null)
            }
        }
    }
    function umount(vnode) {
        hostRemove(vnode.el)
    }
    function patch(n1, n2, container, anchor = null) {
        //判断n1和n2是否相同
        if (n1 && !isSameVNode(n1, n2)) {
            //之前存在节点，但和更新的不同，则删除之前的节点
            umount(n1)
            n1 = null
        }
        const { type, shapeFlags } = n2
        switch (type) {
            case Text:
                processText(n1, n2, container)
                break
            case Fragment:
                processFragment(n1,n2,container)
            default:
                if (shapeFlags & ShapeFlags.ELEMENT) {

                    processElement(n1, n2, container, anchor)
                }
        }
    }
    function render(vnode, container) {
        if (vnode == null) {
            //卸载元素
            if (container._vnode) {
                umount(container._vnode)
            }
        } else {

            //更新元素
            patch(container._vnode || null, vnode, container)
        }
        //将节点保留在容器上
        container._vnode = vnode
    }
    return {
        render
    }

    function normalize(children, i) {
        if (isString(children[i]) || isNumber(children[i])) {
            children[i] = createVNode(Text, null, children[i])
        }
        return children[i]
    }

    function mountChildren(children, container) {
        for (let i = 0; i < children.length; ++i) {
            //如果数组为字符串或者数字，则是文本节点数组，其它的则是元素节点数组
            let child = normalize(children, i)
            patch(null, child, container)
        }
    }
    function unmountChildren(children) {
        children.forEach(child => {
            umount(child)
        })
    }
    function patchChildren(n1, n2, el) {
        let c1 = n1.children
        let c2 = n2.children
        const prevShapeFlag = n1.shapeFlags
        const shapeFlag = n2.shapeFlags
        //如果新孩子是文本
        if (shapeFlag && shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            //之前是数组
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {

                unmountChildren(c1)
            } if (c1 !== c2) {
                //之前要么文本，要么是空
                hostSetElementText(el, c2)
            }
        } else {
            //最新的要么是数组，要么就是空
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                //前后都是数组.
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    //diff算法
                    patchKeyedChildren(c1, c2, el)
                } else {
                    //说明是空
                    unmountChildren(c1)
                }
            } else {
                if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                    hostSetElementText(el, '')
                }
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    mountChildren(c2, el)
                }
            }
        }
    }
    function mountElement(vnode, container, anchor) {

        let { type, shapeFlags, props, children } = vnode
        let el = vnode.el = hostCreateElement(type)
        if (props) {
            //存在属性则更新属性
            patchProps(null, props, el)
        }
        //此时渲染children,其不是文本就是数组
        if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children)
        }
        if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el)
        }
        hostInsert(el, container, anchor)

    }
    function patchElement(n1, n2) {

        //说明n1,n2能复用
        let el = n2.el = n1.el
        let oldProps = n1.props
        let newProps = n2.props
        //比较属性是否相同
        patchProps(oldProps, newProps, el)
        //比较孩子是否相同
        patchChildren(n1, n2, el)
    }
    function processText(n1: any, n2: any, container: any) {
        if (n1 == null) {
            hostInsert(n2.el = hostCreateTextNode(n2.children), container)
        } else {
            //复用老的节点
            const el = n2.el = n1.el
            let newText = n2.children
            if (newText !== n1.children) {
                hostSetText(newText)
            }
        }
    }
    function processElement(n1: any, n2: any, container: any, anchor: any) {
        if (n1 == null) {
            //创建节点
            mountElement(n2, container, anchor)
        } else {
            //更新节点

            patchElement(n1, n2)
        }
    }
    function patchKeyedChildren(c1: any, c2: any, el: any) {
        //    比较c1和c2的差异，尽量复用之前的节点
        let i = 0;
        let e1 = c1.length - 1
        let e2 = c2.length - 1
        while (i <= e1 && i <= e2) {
            const n1 = c1[i]
            const n2 = c2[i]
            if (isSameVNode(n1, n2)) {
                patch(n1, n2, el)
            } else {
                break
            }
            i++
        }
        while (e1 >= 0 && e2 >= 0) {
            const n1 = c1[e1]
            const n2 = c2[e2]
            if (isSameVNode(n1, n2)) {
                patch(n1, n2, el)
            } else {
                break
            }
            e1--
            e2--
        }
        if(i>e1){
            if(i<e1){
                while(i<e2){
                    const nextPos = e2+1
                    let anchor = c2.length<=nextPos?null:c2[nextPos].el
                    patch(null,c2[i],el,anchor)
                    i++
                }
            }
        }
        else if(i>e1){
            if(i<=e1){
                while(i<=e1){
                    umount(c1[i])
                    i++
                }
            }
        }else {
            let s1 = i
            let s2 = i
            let toBePatched = e2-s2+1
            const keyToNewIndexMap = new Map()
            for(let i = s2;i<=e2;i++){
                keyToNewIndexMap.set(c2[i].key,i)
            }
            //初始化一个序列
            const seq = new Array(toBePatched).fill(0)
            for(let i = s1;i<=e1;++i){
                let oldValue = c1[i]
                let newIndex = keyToNewIndexMap.get(c1.key)
                if(newIndex == null){
                    //说明新孩子里不存在这个节点，那就要删除
                    umount(oldValue)
                }else {
                    //记录老旧节点的位置
                    seq[newIndex-s2] = i+1
                     //比较属性
                     patch(oldValue,c2[newIndex],el)
                }
            }
            // 比较儿子
            let incr = getSequence(seq)
            let j = incr.length - 1
            for(let i = toBePatched-1;i>=0;i--){
                const currentIndex = i+s2
                const child = c2[currentIndex]
                const anchor = c2.length<= currentIndex+1?null:c2[currentIndex+1].el
                if(seq[i] === 0){
                    //说明是新增节点
                    patch(null,child,el,anchor)
                }else {
                    if(i!==incr[j]){
                        //需要移动
                        hostInsert(child.el,el,anchor)
                    }else {
                        j--
                    }
                }
            }
        }
    }
    function processFragment(n1: any, n2: any, container: any) {
        if(n1 == null){
            mountChildren(n2.children,container)
        }else {
            patchKeyedChildren(n1.children,n2.children,container)
        }
    }
    

}




