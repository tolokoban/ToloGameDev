import { IWebGL, IShaders, ITextureOptions } from '../types'
import Program from '../program'
import Texture from '../texture'
import Painter from '../painter'
import ListPainter from '../painter/list'
import painter from '../painter'


interface IWebGLSettings {
    // Boolean that indicates if the canvas contains an alpha buffer.
    alpha: boolean
    // Boolean that hints the user agent to reduce the latency by desynchronizing the canvas paint cycle from the event loop.
    desynchronized: boolean
    // Boolean that indicates whether or not to perform anti-aliasing.
    antialias: boolean
    // Boolean that indicates that the drawing buffer has a depth buffer of at least 16 bits.
    depth: boolean
    // Boolean that indicates if a context will be created if the system performance is low or if no hardware GPU is available.
    failIfMajorPerformanceCaveat: boolean
    // A hint to the user agent indicating what configuration of GPU is suitable for the WebGL context. Possible values are:
    // * "default": Let the user agent decide which GPU configuration is most suitable. This is the default value.
    // * "high-performance": Prioritizes rendering performance over power consumption.
    // * "low-power": Prioritizes power saving over rendering performance.
    powerPreference: "default" | "high-performance" | "low-power"
    // Boolean that indicates that the page compositor will assume the drawing buffer contains colors with pre-multiplied alpha.
    premultipliedAlpha: boolean
    // If the value is true the buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
    preserveDrawingBuffer: boolean
    // Boolean that indicates that the drawing buffer has a stencil buffer of at least 8 bits.
    stencil: boolean
}

let globalId = 1

export default class Scene {
    public readonly id = globalId++
    public readonly gl: IWebGL
    public readonly settings: IWebGLSettings
    public readonly webglVersion: number
    private lastWidth = 0
    private lastHeight = 0
    private readonly painterList: ListPainter
    private constantsNames?: Map<number, string>

    constructor(
        public readonly canvas: HTMLCanvasElement,
        settings?: Partial<IWebGLSettings>
    ) {
        this.settings = {
            alpha: false,
            desynchronized: false,
            antialias: false,
            depth: true,
            failIfMajorPerformanceCaveat: false,
            powerPreference: "default",
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            stencil: false,
            ...settings
        }
        const gl2 = canvas.getContext("webgl2", this.settings)
        if (gl2) {
            this.gl = gl2
            this.webglVersion = 2
        } else {
            const gl = canvas.getContext("webgl", this.settings)
            if (!gl) throw "Impossible to create a WebGL context!"
            this.gl = gl
            this.webglVersion = 1
        }
        this.resize()
        this.painterList = new ListPainter(this)
    }

    getConstantName(value: number): string {
        if (!this.constantsNames) {
            this.constantsNames = new Map<number, string>()
            for (const key in this.gl) {
                const val = this.gl[key]
                if (typeof val === 'number') {
                    this.constantsNames.set(val, key)
                }
            }
        }

        const map = this.constantsNames
        if (map.has(value)) {
            return map.get(value) ?? ""
        }
        return ""
    }

    addPainter(...painters: Painter[]) {
        for (const painter of painters) {
            this.painterList.add(painter)
        }
    }

    removePainter(...painters: Painter[]) {
        for (const painter of painters) {
            this.painterList.remove(painter)
        }
    }

    paintAll(time: number) {
        const { painterList } = this
        painterList.paint(time)
        painterList.prepareNextFrame(time)
    }

    public readonly program = {
        create: (shaders: IShaders) => Program.create(this.gl, shaders)
    }

    public readonly texture = {
        fromCamera: (width: number = 0, height: number = 0) =>
            Texture.fromCamera(this.gl, width, height),
        fromURL: (url: string, options?: Partial<ITextureOptions>) =>
            Texture.fromURL(this.gl, url, options),
        fromData: (
            width: number,
            height: number,
            data?: Uint8Array,
            options?: Partial<ITextureOptions>
        ) => Texture.fromData(this.gl, width, height, data, options),
        fromDataLuminance: (
            width: number,
            height: number,
            data?: Uint8Array,
            options?: Partial<ITextureOptions>
        ) => Texture.fromDataLuminance(this.gl, width, height, data, options)
    }

    createArrayBufferStatic(data: ArrayBuffer): WebGLBuffer {
        const { gl } = this
        const buff = gl.createBuffer()
        if (!buff) throw "Unable to create data buffer!"

        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

        return buff
    }

    /**
     * Call this function at every frame render to ensure that the canvas size is reported to the WebGL scene viewport.
     */
    resize() {
        const { lastWidth, lastHeight, canvas, gl } = this
        const rect = canvas.getBoundingClientRect()
        if (lastWidth !== rect.width || lastHeight !== rect.height) {
            canvas.setAttribute("width", `${rect.width}`)
            canvas.setAttribute("height", `${rect.height}`)
            this.lastWidth = rect.width
            this.lastHeight = rect.height
        }
        gl.viewport(0, 0, this.lastWidth, this.lastHeight)
    }

    get width() { return this.gl.drawingBufferWidth }
    get height() { return this.gl.drawingBufferHeight }

    /**
     * Return the current aspect ratio: width / height.
     */
    get aspectRatio() {
        const { gl } = this

        return gl.drawingBufferWidth / gl.drawingBufferHeight
    }
}