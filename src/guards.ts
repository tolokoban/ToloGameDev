import {
    TGDObject,
    TGDPainter,
    TGDPainterAttribute,
    TGDPainterDepth,
    Vector3,
    Vector4,
} from "./types"

export function assertTGDObject(
    data: unknown,
    prefix = "data"
): asserts data is TGDObject {
    assertObject(data, prefix)
    const { id, name } = data
    assertNumber(id, `${prefix}.id`)
    assertString(name, `${prefix}.name`)
}

export function isTGDPainter(data: unknown): data is TGDPainter {
    try {
        assertTGDPainter(data)
        return true
    } catch (ex) {
        console.error("Invalid TGDPainter:", data)
        console.error(ex)
        return false
    }
}

export function assertTGDPainter(
    data: unknown,
    prefix = "data"
): asserts data is TGDPainter {
    assertObject(data, prefix)
    assertTGDObject(data, prefix)
    const {
        error,
        description,
        shader,
        mode,
        count,
        elements,
        attributes,
        depth,
    } = data
    assertStringOrNull(error, `${prefix}.error`)
    assertString(description, `${prefix}.description`)
    assertString(mode, `${prefix}.mode`)
    assertNumberArray(elements, `${prefix}.elements`)
    assertObject(shader, `${prefix}.shader`)
    assertString(shader.vert, `${prefix}.shader.vert`)
    assertString(shader.frag, `${prefix}.shader.frag`)
    assertObject(count, `${prefix}.count`)
    assertNumber(count.instance, `${prefix}.count.instance`)
    assertNumber(count.vertex, `${prefix}.count.vertex`)
    assertNumber(count.element, `${prefix}.count.element`)
    assertArray(attributes, `${prefix}.attributes`)
    for (let i = 0; i < attributes.length; i++) {
        assertTGDPainterAttribute(attributes[i], `${prefix}.attributes[${i}]`)
    }
    assertTGDPainterDepth(depth, `${prefix}.depth`)
}

function assertTGDPainterDepth(
    data: unknown,
    prefix = "depth"
): asserts data is TGDPainterDepth {
    assertObject(data, prefix)
    const { enabled, clear, func, mask, range } = data
    assertBoolean(enabled, `${prefix}.enabled`)
    assertNumber(clear, `${prefix}.clear`)
    assertString(func, `${prefix}.func`)
    assertBoolean(mask, `${prefix}.mask`)
    assertObject(range, `${prefix}.range`)
    assertNumber(range.near, `${prefix}.range.near`)
    assertNumber(range.far, `${prefix}.range.far`)
}

export function assertTGDPainterAttribute(
    obj: unknown,
    prefix = "data"
): asserts obj is TGDPainterAttribute {
    assertObject(obj, prefix)
    const { name, active, type, size, dim, divisor, dynamicGroup, data } = obj
    assertString(name, `${prefix}.name`)
    assertBoolean(active, `${prefix}.active`)
    assertString(type, `${prefix}.type`)
    assertNumber(size, `${prefix}.size`)
    assertNumber(dim, `${prefix}.dim`)
    assertNumber(divisor, `${prefix}.divisor`)
    assertNumber(dynamicGroup, `${prefix}.dynamicGroup`)
    assertArray(data, `${prefix}.data`)
}

export function isObject(data: unknown): data is { [key: string]: unknown } {
    if (Array.isArray(data)) return false
    return typeof data === "object"
}

export function assertObject(
    data: unknown,
    name = "data"
): asserts data is { [key: string]: unknown } {
    if (Array.isArray(data)) {
        console.error(name, data)
        throw Error(`${name} was expected to be an object but we got an array!`)
    }
    if (!isObject(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be an object but we got ${typeof data}!`
        )
    }
}

export function isString(data: unknown): data is string {
    return typeof data === "string"
}

export function assertString(
    data: unknown,
    name = "data"
): asserts data is string {
    if (!isString(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be a string but we got ${typeof data}!`
        )
    }
}

export function assertStringOrNull(
    data: unknown,
    prefix = "data"
): asserts data is string | null {
    if (data === null) return
    try {
        assertString(data, prefix)
    } catch (ex) {
        console.error(ex)
        console.error(prefix, "=", data)
        throw Error(`${prefix} was expected to be a String or null!`)
    }
}

/**
 * Return `data` only if it is a string, otherwise return `defaultValue`.
 */
export function ensureString(data: unknown, defaultValue: string): string {
    return isString(data) ? data : defaultValue
}

export function isStringOrIUndefined(
    data: unknown
): data is string | undefined {
    return typeof data === "string" || typeof data === "undefined"
}

export function assertStringOrIUndefined(
    data: unknown,
    name = "data"
): asserts data is string | undefined {
    if (!isStringOrIUndefined(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to ba a string or undefined but we got ${typeof data}!`
        )
    }
}

export function isNumber(data: unknown): data is number {
    return typeof data === "number"
}

export function assertNumber(
    data: unknown,
    name = "data"
): asserts data is number {
    if (!isNumber(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be a number but we got ${typeof data}!`
        )
    }
}

/**
 * Return `data` only if it is a number, otherwise return `defaultValue`.
 */
export function ensureNumber(data: unknown, defaultValue: number): number {
    return isNumber(data) ? data : defaultValue
}

export function isBoolean(data: unknown): data is boolean {
    return typeof data === "boolean"
}

export function assertBoolean(
    data: unknown,
    name = "data"
): asserts data is boolean {
    if (!isBoolean(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be a boolean but we got ${typeof data}!`
        )
    }
}

export function isArrayBuffer(data: unknown): data is ArrayBuffer {
    if (!data) return false
    return data instanceof ArrayBuffer
}

export function isStringArray(data: unknown): data is string[] {
    if (!Array.isArray(data)) return false
    for (const item of data) {
        if (!isString(item)) return false
    }
    return true
}

export function assertStringArray(
    data: unknown,
    name = "data"
): asserts data is string[] {
    if (!isStringArray(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be an array of strings but we got ${typeof data}!`
        )
    }
}

export function isNumberArray(data: unknown): data is number[] {
    if (!Array.isArray(data)) return false
    for (const item of data) {
        if (!isNumber(item)) return false
    }
    return true
}

export function assertNumberArray(
    data: unknown,
    name = "data"
): asserts data is number[] {
    if (!isNumberArray(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be an array of numbers but we got ${typeof data}!`
        )
    }
}

export function isArray(data: unknown): data is unknown[] {
    return Array.isArray(data)
}

export function assertArray(
    data: unknown,
    name = "data"
): asserts data is unknown[] {
    if (!isArray(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be an array but we got ${typeof data}!`
        )
    }
}

export function assertVector2Array(
    data: unknown,
    suffix = "data"
): asserts data is Array<[number, number]> {
    assertArray(data, suffix)
    for (let i = 0; i < data.length; i++) {
        const elem: unknown = data[i]
        assertVector2(elem, `${suffix}[${i}]`)
    }
}

export function assertVector3Array(
    data: unknown,
    suffix = "data"
): asserts data is Array<[number, number, number]> {
    assertArray(data, suffix)
    for (let i = 0; i < data.length; i++) {
        const elem: unknown = data[i]
        assertVector3(elem, `${suffix}[${i}]`)
    }
}

export function assertVector4Array(
    data: unknown,
    suffix = "data"
): asserts data is Vector4[] {
    assertArray(data, suffix)
    for (let i = 0; i < data.length; i++) {
        const elem: unknown = data[i]
        assertVector4(elem, `${suffix}[${i}]`)
    }
}

export function assertVector2(
    data: unknown,
    suffix = "data"
): asserts data is [number, number] {
    assertArray(data, suffix)
    const [x, y] = data as [unknown, unknown]
    assertNumber(x, `${suffix}[0]`)
    assertNumber(y, `${suffix}[1]`)
}

export function isVector3(data: unknown): data is Vector3 {
    if (!isArray(data)) return false
    if (data.length !== 3) return false
    const [x, y, z] = data as [unknown, unknown, unknown]
    return isNumber(x) && isNumber(y) && isNumber(z)
}

export function assertVector3(
    data: unknown,
    suffix = "data"
): asserts data is [number, number, number] {
    assertArray(data, suffix)
    const [x, y, z] = data as [unknown, unknown, unknown]
    assertNumber(x, `${suffix}[0]`)
    assertNumber(y, `${suffix}[1]`)
    assertNumber(z, `${suffix}[2]`)
}

export function isVector4(data: unknown): data is Vector4 {
    if (!isArray(data)) return false
    if (data.length !== 4) return false
    const [x, y, z, w] = data as [unknown, unknown, unknown, unknown]
    return isNumber(x) && isNumber(y) && isNumber(z) && isNumber(w)
}

export function assertVector4(
    data: unknown,
    suffix = "data"
): asserts data is [number, number, number, number] {
    assertArray(data, suffix)
    const [x, y, z, w] = data as [unknown, unknown, unknown, unknown]
    assertNumber(x, `${suffix}[0]`)
    assertNumber(y, `${suffix}[1]`)
    assertNumber(z, `${suffix}[2]`)
    assertNumber(w, `${suffix}[3]`)
}
