export function getConstName(gl: WebGLRenderingContext, type: number) {
    for (const key in gl) {
        const val = gl[key]
        if (val === type) return key
    }
    return `<${type}>`
}
