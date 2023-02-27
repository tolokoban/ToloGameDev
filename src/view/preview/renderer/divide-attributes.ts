import { TGDPainterAttribute } from "@/types"

export interface TGDPainterAttrbutesGroup {
    dynamic: boolean
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
    return [
        ...divisors.map((divisor) => ({
            dynamic: false,
            divisor,
            attributes: activeAttributes.filter(
                (att) => !att.dynamicGroup && att.divisor === divisor
            ),
        })),
        ...divisors.map((divisor) => ({
            dynamic: true,
            divisor,
            attributes: activeAttributes.filter(
                (att) => att.dynamicGroup && att.divisor === divisor
            ),
        })),
    ]
}
