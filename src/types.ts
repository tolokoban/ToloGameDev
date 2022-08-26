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

export interface TGDPainter extends TGDObject {
    /** Valid if it compiles without error. */
    error: string | null
    description: string
    shader: {
        vert: string
        frag: string
    }
    mode: TGDPainterMode
    count: {
        instance: number
        vertex: number
        element: number
    }
    elements: number[]
    attributes: TGDPainterAttribute[]
    depth: TGDPainterDepth
}

export interface TGDPainterDepth {
    enabled: boolean
    /**
     * Depth value used when the depth buffer is cleared.
     * The value is clamped between 0 and 1.
     *
     * Default value: 1.
     */
    clear: number
    /**
     * Function that compares incoming pixel depth to
     * the current depth buffer value.
     *
     * Default value: LESS.
     */
    func: TGDPainterDepthFunc
    /**
     * Sets whether writing into the depth buffer is
     * enabled or disabled.
     *
     * Default value: true, meaning that writing is enabled.
     */
    mask: boolean
    /**
     * Define the visible range for Z.
     *
     * Default value: [0, 1].
     */
    range: { near: number; far: number }
}

export enum TGDPainterDepthFunc {
    /** Never pass. */
    NEVER,
    /** Pass if the incoming value is less than the depth buffer value. */
    LESS,
    /** Pass if the incoming value equals the depth buffer value. */
    EQUAL,
    /** Pass if the incoming value is less than or equal to the depth buffer value. */
    LEQUAL,
    /** Pass if the incoming value is greater than the depth buffer value. */
    GREATER,
    /** Pass if the incoming value is not equal to the depth buffer value. */
    NOTEQUAL,
    /** Pass if the incoming value is greater than or equal to the depth buffer value. */
    GEQUAL,
    /** Always pass. */
    ALWAYS,
}

export interface TGDShaderAttribute {
    name: string
    type: "float"
    /**
     * Length of the array. Otherwise it should be 1.
     */
    size: number
    /**
     * Dimension. For instance, a `vec4` has a dimension of 4.
     */
    dim: number
}

export interface TGDPainterAttribute extends TGDShaderAttribute {
    /**
     * If not used in a shader, it will be inactive.
     * But we keep it in the object anyway to prevent
     * the user from loosing its settings if the attributes
     * has only been commented for a time.
     */
    active: boolean
    divisor: number
    /**
     * 0 means that this is the static group.
     * All attributes of the same group are in the same Array and interleaved.
     */
    dynamicGroup: number
    /**
     * Initial data in Float32.
     */
    data: number[]
}

export type Vector2 = [number, number]
export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]
