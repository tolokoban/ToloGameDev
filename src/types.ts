export interface TGDObject {
    id: number
    name: string
}

export interface TGDShaders extends TGDObject {
    description: string
    vertexShader: string
    fragmentShader: string
    vertexCount: number
    elementCount: number
    instanceCount: number
    data: {
        attributes: {
            [name: string]: number[]
        }
    }
}
