// eslint-disable-next-line @typescript-eslint/no-empty-function
const X = 0
const Y = 1
const PRESSURE = 2

class PointerWatcher {
    public readonly value = new Float32Array(4)
    private element: Element | null = null

    private static activeWatchers: PointerWatcher[] = []
    private static initialized = false
    private static originX = 0
    private static originY = 0

    constructor(element: Element | null = null) {
        PointerWatcher.initializeIfNotAlreadyDone()
        this.attach(element)
    }

    private static initializeIfNotAlreadyDone() {
        if (PointerWatcher.initialized) return

        window.document.addEventListener(
            "pointerdown",
            (evt: PointerEvent) => {
                PointerWatcher.originX = evt.clientX
                PointerWatcher.originY = evt.clientY
            },
            true
        )
        window.document.addEventListener(
            "pointermove",
            (evt: PointerEvent) => {
                for (const target of PointerWatcher.activeWatchers) {
                    target.handlePointerMove(evt)
                }
            },
            true
        )
        window.document.addEventListener(
            "pointerup",
            (evt: PointerEvent) => {
                for (const target of PointerWatcher.activeWatchers) {
                    target.handlePointerUp(evt)
                }
                PointerWatcher.activeWatchers = []
            },
            true
        )
        PointerWatcher.initialized = true
    }

    attach(element: Element | null) {
        this.detach()

        this.element = element
        if (!element) return

        element.addEventListener("pointerdown", this.handlePointerDown)
        element.addEventListener("contextmenu", this.handleContextMenu)
    }

    detach() {
        const { element } = this
        if (!element) return

        element.removeEventListener("pointerdown", this.handlePointerDown)
        element.removeEventListener("contextmenu", this.handleContextMenu)
    }

    get x() {
        return this.value[X]
    }
    set x(v: number) {
        this.value[X] = v
    }

    get y() {
        return this.value[Y]
    }
    set y(v: number) {
        this.value[Y] = v
    }

    get pressure() {
        return this.value[PRESSURE]
    }
    set pressure(v: number) {
        this.value[PRESSURE] = v
    }

    private readonly handleContextMenu = (evt: Event) => {
        evt.preventDefault()
    }

    private readonly handlePointerDown = (evt: PointerEvent) => {
        const { element } = this
        if (!element) return

        PointerWatcher.activeWatchers.push(this)
        this.setXY(evt)
        this.pressure = 1
    }

    private setXY(evt: PointerEvent) {
        const { left, top, width, height } = this.getElementCorner()
        this.x = (2 * (evt.clientX - left)) / width - 1
        this.y = 1 - (2 * (evt.clientY - top)) / height
    }

    private readonly handlePointerMove = (evt: PointerEvent) => {
        this.setXY(evt)
    }

    private readonly handlePointerUp = (evt: PointerEvent) => {
        this.setXY(evt)
        this.pressure = 0
    }

    private getElementCorner(): {
        left: number
        top: number
        width: number
        height: number
    } {
        const { element } = this
        if (!element) return { left: 0, top: 0, width: 1000, height: 1000 }

        return element.getBoundingClientRect()
    }
}

export default PointerWatcher
