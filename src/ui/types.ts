export type ThemeSize = "none" | "XS" | "S" | "M" | "L" | "XL"

export interface ViewWithValue<T> {
    value: T
    onChange?(this: void, value: T): void
}
