type ColorLevel = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
type ColorAlpha = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
type ColorBase = "neutral" | "primary" | "secondary" | "tertiary"

export type ColorName =
    | OpaqueColorName
    | `${ColorBase}-${ColorLevel}-${ColorAlpha}`
    | `on-${ColorBase}-${ColorLevel}-${ColorAlpha}`

export type OpaqueColorName =
    | `${ColorBase}-${ColorLevel}`
    | `on-${ColorBase}-${ColorLevel}`
    | "error"
    | "on-error"

export type Circumference =
    | string
    | number
    | [vertical: string | number, horizontal: string | number]
    | [
          top: string | number,
          right: string | number,
          bottom: string | number,
          left: string | number
      ]
