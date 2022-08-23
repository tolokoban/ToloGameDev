import FragmentShader from "./painter.frag"
import PainterCompiler from "@/tools/webgl/painter-compiler"
import VertexShader from "./painter.vert"
import { TGDPainter, TGDPainterMode } from "./../types"

export function makeTGDPainter(name?: string): TGDPainter {
    const compiler = new PainterCompiler()
    const painter: TGDPainter = {
        id: -1,
        valid: true,
        name: name ?? makeName("Painter"),
        description: "",
        vertexShader: VertexShader,
        fragmentShader: FragmentShader,
        mode: TGDPainterMode.TRIANGLES,
        attributes: [],
        preview: {
            data: {
                elementCount: 12,
                vertexCount: 5,
                instanceCount: 0,
                // prettier-ignore
                elements: [
                    0, 1, 5,
                    1, 2, 3,
                    3, 4, 5,
                    1, 3, 5
                ],
                attributes: {
                    // prettier-ignore
                    attPoint: [
                        -0.5, +1.0,
                        +0.0, +0.5,
                        +0.5, +1.0,
                        +0.5, -0.5,
                        +0.0, -1.0,
                        -0.5, -0.5
                    ],
                    // prettier-ignore
                    attColor: [
                        1.0, 0.5, 0.0,
                        0.0, 1.0, 1.0,
                        1.0, 0.5, 0.0,
                        0.0, 0.5, 1.0,
                        0.0, 0.2, 0.4,
                        0.0, 0.5, 1.0,
                    ],
                },
            },
        },
    }
    compiler.compile(painter)
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
