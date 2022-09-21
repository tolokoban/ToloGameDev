import { TGDPainterUniformData } from "@/types"

export type UniformSetter = (ctx: UniformSetterContext) => void

export interface UniformSetterContext {
    gl: WebGL2RenderingContext
    time: number
    elementCount: number
    instanceCount: number
    vertexCount: number
    aspectRatio: number
    inverseAspectRatio: number
    aspectRatioContain: Float32Array
    aspectRatioCover: Float32Array
    pointer: Float32Array
    textureSlots: number
}

export function makeUniformSetter(
    location: WebGLUniformLocation,
    data: TGDPainterUniformData,
    ctx: UniformSetterContext
): UniformSetter {
    switch (data.type) {
        case "Time":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1f(location, ctx.time)
        case "Random":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1f(location, Math.random())
        case "AspectRatio":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1f(location, ctx.aspectRatio)
        case "InverseAspectRatio":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1f(location, ctx.inverseAspectRatio)
        case "AspectRatioContain":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform2fv(location, ctx.aspectRatioContain)
        case "AspectRatioCover":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform2fv(location, ctx.aspectRatioCover)
        case "ElementCount":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1f(location, ctx.elementCount)
        case "InstanceCount":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1f(location, ctx.instanceCount)
        case "VertexCount":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1f(location, ctx.vertexCount)
        case "Slider":
        case "Value":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1f(location, data.value)
        case "Pointer":
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform4fv(location, ctx.pointer)
        case "Texture":
            const slot = ctx.textureSlots++
            return (ctx: UniformSetterContext) =>
                ctx.gl.uniform1i(location, slot)
        default:
            console.warn("Unable to create a setter for this uniform:", data)
            return () => {}
    }
}
