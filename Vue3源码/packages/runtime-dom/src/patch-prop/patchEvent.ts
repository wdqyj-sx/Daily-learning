function createInvoker(preValue){
    const invoker = (e)=>{
        invoker.value(e)
    }
    invoker.value = preValue
    return invoker
}

export function patchEvent(el,eventName,nextValue){
    //查找缓存
    const invokers = el._vei || (el.vei = {})
    const exitingInvoker = invokers[eventName] 
    if(exitingInvoker && nextValue){
        exitingInvoker.value = nextValue
    }else {
        //获取事件
        const eName = eventName.slice(2).toLowerCase()
        if(nextValue){
            //创建事件函数
            const invoker = createInvoker(nextValue)
            //存入缓存
            invokers[eventName] = invoker
            el.addEventListener(eName,invoker)
        }else if(exitingInvoker){
            //说明该事件删除了
            el.removeEventListener(eName,exitingInvoker)
            invokers[eventName] = null
        }
    }

}