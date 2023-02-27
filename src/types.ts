import { WEBGL2 } from "./tgd/constants"
export interface TGDObject {
    id: number
    name: string
}

export interface TGDPainter extends TGDObject {
    /** Valid if it compiles without error. */
    error: string | null
    description: string
    shader: {
        vert: string
        frag: string
    }
    mode: keyof typeof WEBGL2.drawPrimitive
    count: {
        instance: number
        vertex: number
        element: number
        /**
         * Number of times draw function will be called.
         * Each time, we set the constant attributes (the one
         * with a negative divisor).
         */
        loop: number
    }
    elements: number[]
    attributes: TGDPainterAttribute[]
    uniforms: TGDPainterUniform[]
    textures: TGDPainterTexture[]
    depth: TGDPainterDepth
    blending: TGDPainterBlending
}

export interface TGDPainterBlending {
    enabled: boolean
    funcSrcRGB: keyof typeof WEBGL2.blendFunc
    funcSrcAlpha: keyof typeof WEBGL2.blendFunc
    funcDstRGB: keyof typeof WEBGL2.blendFunc
    funcDstAlpha: keyof typeof WEBGL2.blendFunc
    equaRGB: keyof typeof WEBGL2.blendEqua
    equaAlpha: keyof typeof WEBGL2.blendEqua
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
    func: keyof typeof WEBGL2.depthFunc
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

export interface TGDShaderAttributeOrUniform {
    name: string
    type: string
    /**
     * Length of the array. Otherwise it should be 1.
     */
    size: number
    /**
     * Dimension. For instance, a `vec4` has a dimension of 4.
     */
    dim: number
    /**
     * If not used in a shader, it will be inactive.
     * But we keep it in the object anyway to prevent
     * the user from loosing its settings if the attributes
     * has only been commented for a time.
     */
    active: boolean
}

export interface TGDPainterAttribute extends TGDShaderAttributeOrUniform {
    /**
     * If 0, this is a normal vertex attribute.
     * If >0, this is an instance attribute.
     * If <0, this is a loop attribute.
     */
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

export type TGDPainterUniformDataType =
    | "Texture"
    | "Error"
    | "Value"
    | "Slider"
    | "Time"
    | "Random"
    | "Pointer"
    | "AspectRatio"
    | "InverseAspectRatio"
    | "AspectRatioCover"
    | "AspectRatioContain"
    | "VertexCount"
    | "ElementCount"
    | "InstanceCount"

export type TGDPainterUniformData =
    | { type: "Texture" }
    | { type: "Error"; message: string }
    | { type: "Value"; value: number }
    | { type: "Slider"; min: number; max: number; value: number }
    | {
          type:
              | "Time"
              | "Random"
              | "Pointer"
              | "AspectRatio"
              | "InverseAspectRatio"
              | "AspectRatioCover"
              | "AspectRatioContain"
              | "VertexCount"
              | "ElementCount"
              | "InstanceCount"
      }

export interface TGDPainterUniform extends TGDShaderAttributeOrUniform {
    data: TGDPainterUniformData
}

export type Vector2 = [number, number]
export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]

export type TGDPainterTexture =
    | TGDPainterTexture2D
    | TGDPainterTexture2DArray
    | TGDPainterTexture3D
    | TGDPainterTextureCubeMap

interface TGDPainterTextureCommon {
    type: keyof typeof WEBGL2.textureType
    name: string
    sampler: TGDPainterTextureSampler
}

export interface TGDPainterTexture2D extends TGDPainterTextureCommon {
    type: "TEXTURE_2D"
}

export interface TGDPainterTexture2DArray extends TGDPainterTextureCommon {
    type: "TEXTURE_2D_ARRAY"
}

export interface TGDPainterTexture3D extends TGDPainterTextureCommon {
    type: "TEXTURE_3D"
}

export interface TGDPainterTextureCubeMap extends TGDPainterTextureCommon {
    type: "TEXTURE_CUBE_MAP"
}

export interface TGDPainterTextureSampler {
    magFilter?: keyof typeof WEBGL2.samplerMagFilter
    minFilter?: keyof typeof WEBGL2.samplerMinFilter
    wrapR?: keyof typeof WEBGL2.samplerWrap
    wrapS?: keyof typeof WEBGL2.samplerWrap
    wrapT?: keyof typeof WEBGL2.samplerWrap
}
