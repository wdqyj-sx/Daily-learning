export function patchClass(el,nextValue){
    if(nextValue === null){
        el.removeAttribute("class")
    }else {
        el.calssName = nextValue
    }
}