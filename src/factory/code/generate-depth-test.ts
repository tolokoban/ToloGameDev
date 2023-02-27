import { TGDPainterDepth } from "../../types"
import { CodeBlock } from "./types"

export function generateDepthTest(depth: TGDPainterDepth): CodeBlock {
    if (depth.enabled)
        return [
            `gl.enable(gl.DEPTH_TEST)`,
            `gl.clearDepth(${depth.clear})`,
            `gl.depthFunc(gl.${depth.func})`,
            `gl.depthMask(${depth.mask})`,
            `gl.depthRange(${depth.range.near}, ${depth.range.far})`,
        ]
    return ["gl.disable(gl.DEPTH_TEST)"]
}
