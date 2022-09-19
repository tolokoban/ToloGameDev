export function getConstName(gl: WebGLRenderingContext, type: number) {
    for (const key in gl) {
        const val = (gl as unknown as { [key: string]: unknown })[key]
        if (val === type) return key
    }
    return `<${type}>`
}
