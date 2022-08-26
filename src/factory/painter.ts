import FragmentShader from "./painter.frag"
import VertexShader from "./painter.vert"
import { TGDPainter, TGDPainterDepthFunc, TGDPainterMode } from "@/types"

export function makeTGDPainter(): TGDPainter {
    const A = Math.sqrt(3) / 2
    const painter: TGDPainter = {
        id: -1,
        error: null,
        name: makeName("Triangle"),
        description: "",
        shader: {
            vert: VertexShader,
            frag: FragmentShader,
        },
        mode: TGDPainterMode.TRIANGLES,
        elements: [],
        count: {
            instance: 0,
            element: 0,
            vertex: 3,
        },
        attributes: [
            {
                name: "attPoint",
                type: "float",
                active: false,
                dim: 2,
                size: 1,
                divisor: 0,
                dynamicGroup: 0,
                data: [0, 1, A, -0.5, -A, -0.5],
            },
            {
                name: "attColor",
                type: "float",
                active: false,
                dim: 3,
                size: 1,
                divisor: 0,
                dynamicGroup: 0,
                data: [1, 0, 0, 0, 1, 0, 0, 0, 1],
            },
        ],
        depth: {
            enabled: true,
            clear: 1,
            func: TGDPainterDepthFunc.LESS,
            mask: true,
            range: { near: 0, far: 1 },
        },
    }
    return painter
}

function makeName(prefix: string): string {
    const d = new Date()
    return `${prefix} ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
    )}`
}

function pad(value: number): string {
    return `${value}`.padStart(2, "0")
}
