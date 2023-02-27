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
    bufferTarget: {
        ARRAY_BUFFER:
            "Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.",
        ELEMENT_ARRAY_BUFFER: "uffer used for element indices.",
        COPY_READ_BUFFER:
            "Buffer for copying from one buffer object to another.",
        COPY_WRITE_BUFFER:
            "Buffer for copying from one buffer object to another.",
        TRANSFORM_FEEDBACK_BUFFER: "Buffer for transform feedback operations.",
        UNIFORM_BUFFER: "Buffer used for storing uniform blocks.",
        PIXEL_PACK_BUFFER: "Buffer used for pixel transfer operations.",
        PIXEL_UNPACK_BUFFER: "Buffer used for pixel transfer operations.",
    },
    bufferUsage: {
        STATIC_DRAW:
            "The contents are intended to be specified once by the application, and used many times as the source for WebGL drawing and image specification commands.",
        DYNAMIC_DRAW:
            "The contents are intended to be respecified repeatedly by the application, and used many times as the source for WebGL drawing and image specification commands.",
        STREAM_DRAW:
            "The contents are intended to be specified once by the application, and used at most a few times as the source for WebGL drawing and image specification commands.",
        STATIC_READ:
            "The contents are intended to be specified once by reading data from WebGL, and queried many times by the application.",
        DYNAMIC_READ:
            "The contents are intended to be respecified repeatedly by reading data from WebGL, and queried many times by the application.",
        STREAM_READ:
            "The contents are intended to be specified once by reading data from WebGL, and queried at most a few times by the application",
        STATIC_COPY:
            "The contents are intended to be specified once by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.",
        DYNAMIC_COPY:
            "The contents are intended to be respecified repeatedly by reading data from WebGL, and used many times as the source for WebGL drawing and image specification commands.",
        STREAM_COPY:
            "The contents are intended to be specified once by reading data from WebGL, and used at most a few times as the source for WebGL drawing and image specification commands.",
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
    enable: {
        BLEND: "Activates blending of the computed fragment color values. See WebGLRenderingContext.blendFunc().",
        CULL_FACE:
            "Activates culling of polygons. See WebGLRenderingContext.cullFace().",
        DEPTH_TEST:
            "Activates depth comparisons and updates to the depth buffer. See WebGLRenderingContext.depthFunc().",
        DITHER: "Activates dithering of color components before they get written to the color buffer.",
        POLYGON_OFFSET_FILL:
            "Activates adding an offset to depth values of polygon's fragments. See WebGLRenderingContext.polygonOffset().",
        SAMPLE_ALPHA_TO_COVERAGE:
            "Activates the computation of a temporary coverage value determined by the alpha value.",
        SAMPLE_COVERAGE:
            "Activates ANDing the fragment's coverage with the temporary coverage value. See WebGLRenderingContext.sampleCoverage().",
        SCISSOR_TEST:
            "Activates the scissor test that discards fragments that are outside of the scissor rectangle. See WebGLRenderingContext.scissor().",
        STENCIL_TEST:
            "Activates stencil testing and updates to the stencil buffer.",
        RASTERIZER_DISCARD:
            "Primitives are discarded immediately before the rasterization stage, but after the optional transform feedback stage. gl.clear() commands are ignored.",
    },
    face: {
        BACK: "",
        FRONT: "",
        FRONT_AND_BACK: "",
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
    stencilFunc: {
        NEVER: "Never pass.",
        LESS: "Pass if (ref & mask) < (stencil & mask).",
        EQUAL: "Pass if (ref & mask) = (stencil & mask).",
        LEQUAL: "Pass if (ref & mask) <= (stencil & mask).",
        GREATER: "Pass if (ref & mask) > (stencil & mask).",
        NOTEQUAL: "Pass if (ref & mask) !== (stencil & mask).",
        GEQUAL: "Pass if (ref & mask) >= (stencil & mask).",
        ALWAYS: "Always pass.",
    },
    stencilOp: {
        KEEP: "Keeps the current value.",
        ZERO: "Sets the stencil buffer value to 0.",
        REPLACE:
            "Sets the stencil buffer value to the reference value as specified by WebGLRenderingContext.stencilFunc().",
        INCR: "Increments the current stencil buffer value. Clamps to the maximum representable unsigned value.",
        INCR_WRAP:
            "Increments the current stencil buffer value. Wraps stencil buffer value to zero when incrementing the maximum representable unsigned value.",
        DECR: "Decrements the current stencil buffer value. Clamps to 0.",
        DECR_WRAP:
            "Decrements the current stencil buffer value. Wraps stencil buffer value to the maximum representable unsigned value when decrementing a stencil buffer value of 0.",
        INVERT: "Inverts the current stencil buffer value bitwise.",
    },
    textureType: {
        TEXTURE_2D: "A two-dimensional texture.",
        TEXTURE_2D_ARRAY: "A two-dimensional array texture.",
        TEXTURE_3D: "A three-dimensional texture.",
        TEXTURE_CUBE_MAP: "A cube-mapped texture.",
    },
    textureTarget: {
        TEXTURE_2D: "A two-dimensional texture.",
        TEXTURE_CUBE_MAP_POSITIVE_X:
            "Positive X face for a cube-mapped texture.",
        TEXTURE_CUBE_MAP_NEGATIVE_X:
            "Negative X face for a cube-mapped texture.",
        TEXTURE_CUBE_MAP_POSITIVE_Y:
            "Positive Y face for a cube-mapped texture.",
        TEXTURE_CUBE_MAP_NEGATIVE_Y:
            "Negative Y face for a cube-mapped texture.",
        TEXTURE_CUBE_MAP_POSITIVE_Z:
            "Positive Z face for a cube-mapped texture.",
        TEXTURE_CUBE_MAP_NEGATIVE_Z:
            "Negative Z face for a cube-mapped texture.",
    },
}

export const EMPTY_FUNC = () => {}
