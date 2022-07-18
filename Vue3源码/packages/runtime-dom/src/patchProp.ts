import {patchAttr} from "./patch-prop/patchAttr"
import {patchClass} from "./patch-prop/patchClass"
import {patchEvent} from "./patch-prop/patchEvent"
import {patchStyle} from "./patch-prop/patchStyle"

export const patchProp = (el,key,preValue,nextValue)=>{
    if(key === 'clsss'){
        patchClass(el,nextValue)
    }else if(key === 'style'){
        patchStyle(el,preValue,nextValue)
    }else if(/on[^a-z]/.test(key)){
        patchEvent(el,key,nextValue)
    }else {
        patchAttr(el,key,nextValue)
    }
}