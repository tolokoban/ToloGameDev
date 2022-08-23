import { TGDPainterAttribute } from "@/types"

export function computeStride(attributes: TGDPainterAttribute[]): number {
    let stride = 0
    for (const att of attributes) {
        stride += att.dim * att.size
    }
    return stride * Float32Array.BYTES_PER_ELEMENT
}
