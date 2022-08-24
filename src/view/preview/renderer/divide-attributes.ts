import { TGDPainterAttribute } from "@/types"

export interface TGDPainterAttrbutesGroup {
    divisor: number
    attributes: TGDPainterAttribute[]
}

export function divideAttributes(
    attributes: TGDPainterAttribute[]
): TGDPainterAttrbutesGroup[] {
    const divisors = Array.from(
        new Set<number>(attributes.map((att) => att.divisor))
    )
    return divisors.map((divisor) => ({
        divisor,
        attributes: attributes.filter((att) => att.divisor === divisor),
    }))
}
