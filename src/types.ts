export interface TGDObject {
    id: number
    name: string
}

export enum TGDPainterMode {
    POINTS = 1,
    LINE_STRIP,
    LINE_LOOP,
    LINES,
    TRIANGLE_STRIP,
    TRIANGLE_FAN,
    TRIANGLES,
}

export interface TGDPainterData {
    vertexCount: number
    elementCount: number
    instanceCount: number
    elements?: number[]
    attributes: {
        [name: string]: number[]
    }
}

export interface TGDPainter extends TGDObject {
    description: string
    vertexShader: string
    fragmentShader: string
    mode: TGDPainterMode
    attributes: TGDPainterAttribute[]
    preview: {
        data: TGDPainterData
    }
}

export interface TGDPainterAttribute {
    name: string
    type: "float"
    size: number
    /**
     * Dimension. For instance, a `vec4` has a dimension of 4.
     */
    dim: number
    divisor: number
    /**
     * 0 means that this is the static group.
     * All attributes of the same group are in the same Array and interleaved.
     */
    dynamicGroup: number
}
