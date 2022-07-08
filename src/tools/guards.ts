export function isObject(data: unknown): data is { [key: string]: unknown } {
    if (!data) return false
    return typeof data === "object"
}

export function isNumber(data: unknown): data is number {
    return typeof data === "number"
}
