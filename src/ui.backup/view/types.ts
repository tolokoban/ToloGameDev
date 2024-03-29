export type ThemeColorName =
    | "primary"
    | "primary-dark"
    | "primary-light"
    | "accent"
    | "accent-dark"
    | "accent-light"
    | "screen"
    | "frame"
    | "section"
    | "input"
    | "error"

export type ColorName =
    | ThemeColorName
    | `#${string}`
    | `rgb(${string})`
    | "inherit"

export interface View {
    className?: string
}

export interface ViewWithSize {
    /** Default to "medium" */
    size?: "small" | "medium" | "large"
}

export interface ViewWithColor {
    color?: ColorName
}

export interface ViewWithValue<T> {
    value: T
    onChange?(this: void, value: T): void
}

export interface ViewWithChangeableValue<T> {
    value: T
    onChange(this: void, value: T): void
}

export type ViewWithChangeableStringifyableValue<T> =
    ViewWithChangeableValue<T> & {
        stringify(value: T): string
        parse(text: string): T
    }

export interface ViewWithName {
    /** Name used for forms. */
    name?: string
}
