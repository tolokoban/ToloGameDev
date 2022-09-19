export function throwError(ex: unknown): never {
    throw makeError(ex)
}

export function makeError(ex: unknown): Error {
    if (ex instanceof Error) return ex

    return Error(`${ex}`)
}
