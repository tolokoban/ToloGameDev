export const WEBGL2 = {
    blendEqua: {
        FUNC_ADD: "src + dst",
        FUNC_SUBTRACT: "src - dst",
        FUNC_REVERSE_SUBTRACT: "dst - src",
        MIN: "Min(src, dst)",
        MAX: "Max(src, dst)",
    },
    blendFunc: {
        ZERO: "",
        ONE: "",
        SRC_COLOR: "",
        ONE_MINUS_SRC_COLOR: "",
        DST_COLOR: "",
        ONE_MINUS_DST_COLOR: "",
        SRC_ALPHA: "",
        ONE_MINUS_SRC_ALPHA: "",
        DST_ALPHA: "",
        ONE_MINUS_DST_ALPHA: "",
        CONSTANT_COLOR: "",
        ONE_MINUS_CONSTANT_COLOR: "",
        CONSTANT_ALPHA: "",
        ONE_MINUS_CONSTANT_ALPHA: "",
        SRC_ALPHA_SATURATE: "",
    },
    depthFunc: {
        NEVER: "Never pass.",
        LESS: "Pass if the incoming value is less than the depth buffer value.",
        EQUAL: "Pass if the incoming value equals the depth buffer value.",
        LEQUAL: "Pass if the incoming value is less than or equal to the depth buffer value.",
        GREATER:
            "Pass if the incoming value is greater than the depth buffer value.",
        NOTEQUAL:
            "Pass if the incoming value is not equal to the depth buffer value.",
        GEQUAL: "Pass if the incoming value is greater than or equal to the depth buffer value.",
        ALWAYS: "Always pass.",
    },
    drawPrimitive: {
        POINTS: "Single dot per vertex",
        LINE_STRIP: "One line going through all vertices",
        LINE_LOOP:
            "One line going through all vertices and looping to the first one",
        LINES: "Lines segments for two consecutive vertices",
        TRIANGLE_STRIP:
            "For each vertex, take the previous two to draw a triangle",
        TRIANGLE_FAN: "The first vertex is common to all triangles",
        TRIANGLES: "Triangles for each triplet of vertices",
    },
    samplerMinFilter: {
        NEAREST: "",
        LINEAR: "",
        NEAREST_MIPMAP_NEAREST: "",
        NEAREST_MIPMAP_LINEAR: "",
        LINEAR_MIPMAP_NEAREST: "",
        LINEAR_MIPMAP_LINEAR: "",
    },
    samplerMagFilter: {
        NEAREST: "",
        LINEAR: "",
    },
    samplerWrap: {
        REPEAT: "",
        CLAMP_TO_EDGE: "",
        MIRRORED_REPEAT: "",
    },
    texture: {
        TEXTURE_2D: "A two-dimensional texture.",
        TEXTURE_2D_ARRAY: "A two-dimensional array texture.",
        TEXTURE_3D: "A three-dimensional texture.",
        TEXTURE_CUBE_MAP: "A cube-mapped texture.",
    },
}

export const EMPTY_FUNC = () => {}
