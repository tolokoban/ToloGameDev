import { TGDShaders } from "./types"

export const DEFAULT_SHADERS: TGDShaders = {
    id: 0,
    name: "",
    description: "",
    fragmentShader: "",
    vertexShader: "",
    vertexCount: 0,
    elementCount: 0,
    instanceCount: 0,
    data: {
        attributes: {
            attPoint: [-0.5, -0.5, +0.5, -0.5, +0.5, +0.5, -0.5, +0.5],
            attColor: [],
        },
    },
}
