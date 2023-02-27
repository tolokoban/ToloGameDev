export default class Resources {
    private static resources = new Map<
        WebGL2RenderingContext,
        Map<string, Resources>
    >()

    static make(gl: WebGL2RenderingContext, id: string) {
        const mapId: Map<string, Resources> = getOrMakeMapId(
            Resources.resources,
            gl
        )
        const resFromCache = mapId.get(id)
        if (resFromCache) return resFromCache

        const res = new Resources(gl)
        mapId.set(id, res)
        return res
    }

    private constructor(private readonly gl: WebGL2RenderingContext) {}
}

function getOrMakeMapId(
    resources: Map<WebGL2RenderingContext, Map<string, Resources>>,
    gl: WebGL2RenderingContext
): Map<string, Resources> {
    const item = resources.get(gl)
    if (item) return item

    const newItem = new Map<string, Resources>()
    resources.set(gl, newItem)
    return newItem
}
