import * as React from "react"
import { getDataService } from "@/factory/data-service"
import { makeTGDPainter } from "@/factory/painter"
import {
    TGDPainter,
    TGDPainterAttribute,
    TGDPainterDepth,
    TGDPainterDepthFunc,
    TGDPainterMode,
} from "@/types"

export function usePainterUpdater(initialValue?: TGDPainter) {
    const value: TGDPainter = initialValue ?? makeTGDPainter()
    const [currentPainter, setCurrentPainter] = React.useState(value)
    const [stablePainter, setStablePainter] = React.useState(value)
    const refUpdater = React.useRef(
        new PainterUpdater(
            currentPainter,
            stablePainter,
            setCurrentPainter,
            setStablePainter
        )
    )
    return refUpdater.current
}

export class PainterUpdater {
    private _currentPainter: TGDPainter
    private _stablePainter: TGDPainter
    private readonly setCurrentPainter: (painter: TGDPainter) => void
    private readonly setStablePainter: (painter: TGDPainter) => void

    constructor(
        currentPainter: TGDPainter,
        stablePainter: TGDPainter,
        setCurrentPainter: (painter: TGDPainter) => void,
        setStablePainter: (painter: TGDPainter) => void
    ) {
        this._currentPainter = currentPainter
        this._stablePainter = stablePainter
        this.setCurrentPainter = (painter: TGDPainter) => {
            this._currentPainter = painter
            setCurrentPainter(painter)
        }
        this.setStablePainter = (painter: TGDPainter) => {
            this._stablePainter = painter
            setStablePainter(painter)
        }
    }

    public get currentPainter() {
        return this._currentPainter
    }
    public get stablePainter() {
        return this._stablePainter
    }

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
    public readonly updateDepth = (update: Partial<TGDPainterDepth>) => {
        const painter: TGDPainter = this.currentPainter
        this.setCurrentPainter({
            ...painter,
            depth: { ...painter.depth, ...update },
        })
    }
    public readonly setDepthEnabled = (enabled: boolean) => {
        this.updateDepth({ enabled })
    }
    public readonly setDepthClear = (clear: number) => {
        this.updateDepth({ clear })
    }
    public readonly setDepthMask = (mask: boolean) => {
        this.updateDepth({ mask })
    }
    public readonly setDepthFunc = (func: TGDPainterDepthFunc) => {
        this.updateDepth({ func })
    }
    public readonly setDepthRangeNear = (near: number) => {
        const range = this.currentPainter.depth.range
        this.updateDepth({ range: { ...range, near } })
    }
    public readonly setDepthRangeFar = (far: number) => {
        const range = this.currentPainter.depth.range
        this.updateDepth({ range: { ...range, far } })
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
