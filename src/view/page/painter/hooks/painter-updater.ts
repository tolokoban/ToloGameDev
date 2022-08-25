import * as React from "react"
import painter from ".."
import { getDataService } from "@/factory/data-service"
import { TGDPainter, TGDPainterAttribute, TGDPainterMode } from "@/types"

export function usePainterUpdater(initialValue: TGDPainter = DEFAULT_PAINTER) {
    const [currentPainter, setCurrentPainter] = React.useState(initialValue)
    const [stablePainter, setStablePainter] = React.useState(initialValue)
    return new PainterUpdater(
        currentPainter,
        stablePainter,
        setCurrentPainter,
        setStablePainter
    )
}

export class PainterUpdater {
    constructor(
        public readonly currentPainter: TGDPainter,
        public readonly stablePainter: TGDPainter,
        private readonly setCurrentPainter: (painter: TGDPainter) => void,
        private readonly setStablePainter: (painter: TGDPainter) => void
    ) {}

    public readonly reset = (painter: TGDPainter) => {
        this.setCurrentPainter({ ...painter })
        return this
    }
    public readonly validate = async (): Promise<number> => {
        const painter: TGDPainter = this.currentPainter
        if (!painter.error) {
            this.setStablePainter(painter)
            return await getDataService().painter.store(painter)
        }
        return 0
    }
    public readonly setError = (error: string) => {
        this.setCurrentPainter({
            ...this.currentPainter,
            error,
        })
    }
    public readonly clearError = () => {
        this.setCurrentPainter({
            ...this.currentPainter,
            error: null,
        })
    }
    public readonly setName = (name: string) => {
        this.setCurrentPainter({
            ...this.currentPainter,
            name,
        })
    }
    public readonly setDescription = (description: string) => {
        this.setCurrentPainter({
            ...this.currentPainter,
            description,
        })
    }
    public readonly setElements = (elements: number[]) => {
        const painter = this.currentPainter
        if (painter.elements !== elements) {
            this.setCurrentPainter({
                ...painter,
                elements,
            })
        }
    }
    public readonly setVertexShader = (vertexShader: string) => {
        const painter = this.currentPainter
        this.setCurrentPainter({
            ...this.currentPainter,
            shader: {
                ...painter.shader,
                vert: vertexShader,
            },
        })
    }
    public readonly setFragmentShader = (fragmentShader: string) => {
        const painter = this.currentPainter
        this.setCurrentPainter({
            ...this.currentPainter,
            shader: {
                ...painter.shader,
                frag: fragmentShader,
            },
        })
    }
    public readonly setMode = (mode: TGDPainterMode) => {
        this.setCurrentPainter({
            ...this.currentPainter,
            mode,
        })
    }
    public readonly setInstanceCount = (instance: number) => {
        const painter = this.currentPainter
        this.setCurrentPainter({
            ...painter,
            count: { ...painter.count, instance },
        })
    }
    public readonly setVertexCount = (vertex: number) => {
        const painter = this.currentPainter
        this.setCurrentPainter({
            ...painter,
            count: { ...painter.count, vertex },
        })
    }
    public readonly setElementCount = (element: number) => {
        const painter = this.currentPainter
        this.setCurrentPainter({
            ...painter,
            count: { ...painter.count, element },
        })
    }
    public readonly updateAttribute = (
        name: string,
        update: Omit<Partial<TGDPainterAttribute>, "name">
    ) => {
        const painter: TGDPainter = this.currentPainter
        const updatedAttribute = {
            ...this.getOrCreateAttrib(name),
            ...update,
        }
        this.setCurrentPainter({
            ...painter,
            attributes: painter.attributes.map((att) =>
                att.name === name ? updatedAttribute : att
            ),
        })
    }
    public readonly deactivateAttributes = () => {
        const painter: TGDPainter = this.currentPainter
        this.setCurrentPainter({
            ...painter,
            attributes: painter.attributes.map((att) => ({
                ...att,
                active: false,
            })),
        })
    }

    private getOrCreateAttrib(name: string): TGDPainterAttribute {
        const att = this.currentPainter.attributes.find((a) => a.name === name)
        if (att) return att

        const newAtt: TGDPainterAttribute = {
            name,
            active: false,
            data: [],
            dim: 1,
            divisor: 0,
            dynamicGroup: 0,
            size: 1,
            type: "float",
        }
        this.currentPainter.attributes.push(newAtt)
        return newAtt
    }
}

const DEFAULT_PAINTER: TGDPainter = {
    attributes: [],
    count: { element: 0, instance: 0, vertex: 0 },
    description: "",
    elements: [],
    error: "No shader code defined yet!",
    id: 0,
    mode: TGDPainterMode.TRIANGLES,
    name: "",
    shader: {
        vert: "",
        frag: "",
    },
}
