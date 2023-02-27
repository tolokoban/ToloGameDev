const globalIdsMap = new Map<string, number>()

export function createId(prefix = "ui-"): string {
    const id = globalIdsMap.get(prefix) ?? 0
    globalIdsMap.set(prefix, id + 1)
    return `${prefix}${id}`
}
