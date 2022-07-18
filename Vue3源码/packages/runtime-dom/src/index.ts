import { createRenderer } from "packages/runtime-core/src/renderer"
import { nodeOps} from "./nodeOps"
import {patchProp} from "./patchProp"

export * from "@vue/runtime-core"

const renderOptions = {patchProp,...nodeOps}

export function render(vnode,container){
    let {render} = createRenderer(renderOptions)
    return render(vnode,container)
}