import TGD from 'tolo-game-dev'
import VertShader from './tree.vert'
import FragShader from './tree.frag'
import TreeImage from '../gfx/tree.webp'


export default { start }

class IScene extends TGD.Scene { }

function start(canvas: HTMLCanvasElement) {
    const app = new App(canvas)
    app.render(0)
}

const VEC2_SIZE = 2
const VEC3_SIZE = 3
const VEC2_BYTES = Float32Array.BYTES_PER_ELEMENT * VEC2_SIZE
const VEC3_BYTES = Float32Array.BYTES_PER_ELEMENT * VEC3_SIZE
const COUNT = 15

class App {
    private readonly scene: IScene
    private readonly gl: WebGLRenderingContext
    private readonly prg: WebGLProgram
    private readonly tex: WebGLTexture
    private W = 0
    private H = 0
    private camera = new Float32Array([0, 0, 0])
    private readonly uniAspectRatio: WebGLUniformLocation
    private readonly uniTexture: WebGLUniformLocation
    private readonly uniCamera: WebGLUniformLocation
    private readonly attPoint: number
    private readonly attUV: number
    private readonly buffElem: WebGLBuffer
    private readonly buffData: WebGLBuffer

    constructor(private readonly canvas: HTMLCanvasElement) {
        const scene = new TGD.Scene(canvas, { depth: true })
        this.scene = scene
        this.gl = scene.gl
        this.prg = scene.program.create({
            vert: VertShader,
            frag: FragShader
        })
        this.tex = createTexture(this.gl)
        this.gl.useProgram(this.prg)
        this.uniAspectRatio = this.getUniformLocation("uniAspectRatio")
        this.uniTexture = this.getUniformLocation("uniTexture")
        this.uniCamera = this.getUniformLocation("uniCamera")
        this.attPoint = this.getAttributeLocation("attPoint")
        this.attUV = this.getAttributeLocation("attUV")
        this.buffElem = createBuffElem(this.gl, COUNT)
        this.buffData = createBuffData(this.gl, COUNT)

        const { gl, attUV, attPoint } = this
        gl.useProgram(this.prg)
        gl.enableVertexAttribArray(attUV)
        gl.vertexAttribPointer(
            attUV,
            VEC2_SIZE,
            gl.FLOAT,
            false,
            0,
            0
        )
        gl.enableVertexAttribArray(attPoint)
        gl.vertexAttribPointer(
            attPoint,
            VEC3_SIZE,
            gl.FLOAT,
            false,
            0,
            VEC2_BYTES * 4 * COUNT
        )
    }

    private getUniformLocation(name: string): WebGLUniformLocation {
        const location = this.gl.getUniformLocation(
            this.prg, name
        )
        if (location === null) throw `Uniform "${name}" does not exist!`

        return location
    }

    private getAttributeLocation(name: string) {
        const location = this.gl.getAttribLocation(
            this.prg, name
        )
        if (location === null) throw `Attribute "${name}" does not exist!`

        return location
    }

    private resize() {
        const {
            W, H, canvas, gl
        } = this
        const rect = canvas.getBoundingClientRect()
        if (W !== rect.width || H !== rect.height) {
            canvas.setAttribute("width", `${rect.width}`)
            canvas.setAttribute("height", `${rect.height}`)
            this.W = rect.width
            this.H = rect.height
            gl.viewport(0, 0, this.W, this.H)
        }
    }

    render = (time: number) => {
        window.requestAnimationFrame(this.render)

        const {
            scene,
            W, H, gl, prg, camera,
            uniCamera, uniTexture,
            buffData, buffElem,
            attUV, attPoint
        } = this
        scene.resize()

        this.camera[0] = Math.cos(time * 0.001048) * 1
        this.camera[1] = Math.sin(time * 0.001341) * 0.2
        this.camera[2] = Math.sin(time * 0.001177) * 0.3

        gl.enable(gl.DEPTH_TEST)
        gl.depthRange(0, 1)
        gl.depthFunc(gl.LESS)
        gl.clearColor(0.2, 0.6, 1, 1)
        gl.clearDepth(1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.useProgram(prg)
        gl.activeTexture(gl.TEXTURE0)
        gl.uniform1f(this.uniAspectRatio, scene.aspectRatio)
        gl.uniform3fv(uniCamera, camera)
        gl.uniform1i(uniTexture, 0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffElem)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffData)

        gl.drawElements(
            gl.TRIANGLES,
            6 * COUNT,
            gl.UNSIGNED_BYTE,
            0
        )
    }
}

function createBuffElem(gl: WebGLRenderingContext, count: number) {
    const buffElem = gl.createBuffer()
    if (!buffElem) throw "Unable to create elem buffer!"

    const arr: number[] = []
    for (let i = 0; i < count; i++) {
        const i0 = i * 4
        const i1 = i0 + 1
        const i2 = i0 + 2
        const i3 = i0 + 3
        arr.push(
            i0, i2, i3,
            i0, i3, i1
        )
    }
    const elem = new Uint8Array(arr)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffElem)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elem, gl.STATIC_DRAW)

    return buffElem
}

function createBuffData(gl: WebGLRenderingContext, count: number) {
    const buffData = gl.createBuffer()
    if (!buffData) throw "Unable to create data buffer!"

    const arrUV: number[] = []
    const arrPoint: number[] = []
    for (let i = 0; i < count; i++) {
        arrUV.push(
            0, 0,
            1, 0,
            0, 1,
            1, 1
        )
        const x = Math.random() * 4 - 2
        const y = 1 + i * 0.2
        const z = 0
        const w = .5
        const h = 1
        arrPoint.push(
            x - w, y, z + h,
            x + w, y, z + h,
            x - w, y, z - h,
            x + w, y, z - h
        )
    }
    const data = new Float32Array([
        ...arrUV,
        ...arrPoint
    ])
    gl.bindBuffer(gl.ARRAY_BUFFER, buffData)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    return buffData
}

function createTexture(gl: WebGLRenderingContext) {
    const texture = gl.createTexture()
    if (!texture) throw "Unable to create Texture!"

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    // Default image is a unique pixel fully transparent (0,0,0,0).
    const imageData = new Uint8Array([0, 0, 0, 0])
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA,
        1, 1, 0,
        gl.RGBA, gl.UNSIGNED_BYTE,
        imageData)

    const imgTree = new Image()
    imgTree.src = TreeImage
    imgTree.onload = () => {
        console.log("Image has been loaded...")
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgTree)
    }

    return texture
}

function createProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
    const prg = gl.createProgram()
    if (!prg) throw "Unable to create Program!"

    gl.attachShader(prg, loadVertexShader(gl, vert))
    gl.attachShader(prg, loadFragmentShader(gl, frag))
    gl.linkProgram(prg)
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        throw `Unable to link the shader program: ${gl.getProgramInfoLog(prg)}`
    }
    gl.useProgram(prg)

    return prg
}

function loadVertexShader(gl: WebGLRenderingContext, code: string) {
    try {
        console.log("[app] VERT = ", code) // @FIXME: Remove this line written on 2020-12-18 at 23:52
        return loadShader(gl, code, gl.VERTEX_SHADER)
    } catch (ex) {
        console.info(code)
        throw `Unable to compile VERTEX shader: ${ex}`
    }
}

function loadFragmentShader(gl: WebGLRenderingContext, code: string) {
    try {
        console.log("[app] FRAG = ", code) // @FIXME: Remove this line written on 2020-12-18 at 23:52
        return loadShader(gl, code, gl.FRAGMENT_SHADER)
    } catch (ex) {
        console.info(code)
        throw `Unable to compile FRAGMENT shader: ${ex}`
    }
}

function loadShader(gl: WebGLRenderingContext, code: string, type: number) {
    const shader = gl.createShader(type)
    if (!shader) throw `Invalid shader type: ${type}!`

    gl.shaderSource(shader, code)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw message
    }

    return shader
}

function createWebglContext(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
        desynchronized: false,
        depth: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        strencil: false
    }) as WebGLRenderingContext | null
    if (!gl) throw "Unable to create Webgl context!"

    return gl
}