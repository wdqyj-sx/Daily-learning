import { createRenderer } from "packages/runtime-core/src/renderer"
import { nodeOps} from "./nodeOps"
import {patchProp} from "./patchProp"

export * from "@vue/runtime-core"

const renderOptions = {patchProp,...nodeOps}

//vue内置的渲染器，也可以通过createRenderer创建一个渲染器
export function render(vnode,container){
    let {render} = createRenderer(renderOptions)
    return render(vnode,container)
}

export * from "@vue/runtime-core"