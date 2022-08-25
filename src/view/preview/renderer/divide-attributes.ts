import { TGDPainterAttribute } from "@/types"

export interface TGDPainterAttrbutesGroup {
    divisor: number
    attributes: TGDPainterAttribute[]
}

export function divideAttributes(
    attributes: TGDPainterAttribute[]
): TGDPainterAttrbutesGroup[] {
    const activeAttributes = attributes.filter((att) => att.active)
    const divisors = Array.from(
        new Set<number>(activeAttributes.map((att) => att.divisor))
    )
    return divisors.map((divisor) => ({
        divisor,
        attributes: activeAttributes.filter((att) => att.divisor === divisor),
    }))
}
