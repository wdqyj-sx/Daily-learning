export function patchStyle(el,preValue,nextValue){
    const style = el.style
    //新的有的，赋值给老的
    for(let key in nextValue){
        style[key] = nextValue[key]
    }
    //新的没有的，老值中删掉
    if(preValue){
        for(let key in preValue){
            if(nextValue[key] === null){
                style[key] = null
            }
        }
    }
}