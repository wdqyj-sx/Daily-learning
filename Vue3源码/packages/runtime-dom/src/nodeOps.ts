export const nodeOps = {
    //创建元素
    createElement(tagName){
        return document.createElement(tagName)
    },
    //创建文本节点
    createTextNode(text){
        return document.createTextNode(text)
    },
    //插入子节点
    insert(element,container,anchor = null){
        container.insertBefore(element,anchor)
    },
    //移除节点
    remove(child){
        const parent = child.parentNode
        if(parent){
            parent.removeChild(child)
        }
    },
    //查询元素
    querySelector(selectors){
        return document.querySelector(selectors)
    },
    //父节点
    parentNode(child){
        return child.parentNode
    },
    //查找兄弟节点
    nextSibling(child){
        return child.nextSibling
    },
    //给文本节点设置内容
    setText(element,text){
        element.nodeValue = text
    },
    //元素节点设置内容
    setElementText(element,text){
        element.textContent = text;
    }


}