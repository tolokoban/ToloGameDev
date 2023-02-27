/**
 * ```
 * interleaveFloat32(
 *   [[1,2,3,4,5,6], 2],
 *   [[7,8,9], 1]
 * ) === new Float32Array([
 *   1, 2, 7,
 *   3, 4, 8,
 *   5, 6, 9
 * ])
 * ```
 */
export function interleaveFloat32(
    ...inputs: Array<[data: number[], size: number]>
): Float32Array {
    const attributeSize = inputs
        .map(([_data, size]) => size)
        .reduce((total, value) => total + value, 0)
    if (attributeSize <= 0) return new Float32Array()

    const attributesCount = inputs
        .map(([data, size]) => Math.floor(data.length / size))
        .reduce((previous, current) => Math.min(previous, current), 1e10)
    const offsets = inputs.map(() => 0)
    const array = new Float32Array(attributeSize * attributesCount)
    let cursor = 0
    for (let k = 0; k < attributesCount; k++) {
        for (let idx = 0; idx < inputs.length; idx++) {
            const [data, size] = inputs[idx]
            let offset = offsets[idx]
            for (let j = 0; j < size; j++) {
                array[cursor++] = data[offset++]
            }
            offsets[idx] = offset
        }
    }
    return array
}
