import { TGDPainterBlending } from "./../../types"
import { TGDPainterDepth } from "../../types"
import { CodeBlock } from "./types"
import { Code } from "@mui/icons-material"

export function generateBlendTest(blend: TGDPainterBlending): CodeBlock {
    if (blend.enabled) {
        const code: CodeBlock = [`gl.enable(gl.BLEND)`]
        if (blend.equaRGB === blend.equaAlpha) {
            code.push(`gl.blendEquation(gl.${blend.equaRGB})`)
        } else {
            code.push(
                `gl.blendEquationDeparate(gl.${blend.equaRGB}, gl.${blend.equaAlpha})`
            )
        }
        if (
            blend.funcSrcRGB === blend.funcSrcAlpha &&
            blend.funcDstRGB === blend.funcDstAlpha
        ) {
            code.push(
                `gl.blendFunc(gl.${blend.funcSrcRGB}, gl.${blend.funcDstRGB})`
            )
        } else {
            code.push(
                "gl.blendFuncSeparate(",
                [
                    `gl.${blend.funcSrcRGB}`,
                    `gl.${blend.funcDstRGB}`,
                    `gl.${blend.funcSrcAlpha}`,
                    `gl.${blend.funcDstAlpha}`,
                ],
                ")"
            )
        }
        return code
    }
    return ["gl.disable(gl.BLEND)"]
}
