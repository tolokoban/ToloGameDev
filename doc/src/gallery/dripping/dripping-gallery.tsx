import * as React from "react"
import TGD from 'tolo-game-dev'
import Scene from '../../view/scene'
import Vert1 from './dripping1.vert'
import Vert2 from './dripping2.vert'
import Frag1 from './dripping1.frag'
import Frag2 from './dripping2.frag'

import './dripping-gallery.css'

class IScene extends TGD.Scene { }


export interface IDrippingGalleryProps {
    className?: string
}

// tslint:disable-next-line: no-empty-interface
interface IDrippingGalleryState { }

const WIDTH = 2048
const HEIGHT = 2048

export default class DrippingGallery extends React.Component<IDrippingGalleryProps, IDrippingGalleryState> {
    state: IDrippingGalleryState = {}

    render() {
        const classNames = ['custom', 'gallery-DrippingGallery']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <Scene
                className="canvas"
                onInit={init}
                onAnim={anim}
                width={1024}
                height={1024}
            />
        </div>
    }
}


interface IDripper {
    uniAspectRatioView: WebGLUniformLocation | null
    uniTextureView: WebGLUniformLocation | null
    uniTextureBuff: WebGLUniformLocation | null
    uniY: WebGLUniformLocation | null
    texView: WebGLTexture
    texBuff: WebGLTexture
    prgView: WebGLProgram
    prgBuff: WebGLProgram
    dataView: Data
    framebuffer: WebGLFramebuffer
    y: number
}

function init(scene: IScene): IDripper {
    const prgView = scene.program.create({
        vert: Vert1,
        frag: Frag1
    })
    const prgBuff = scene.program.create({
        vert: Vert2,
        frag: Frag2
    })
    const dataView = new Data(scene.gl, 4)
    dataView.init(prgView)
    dataView.init(prgBuff)
    dataView.set(-1, +1, 0, 0)
    dataView.set(+1, +1, 255, 0)
    dataView.set(-1, -1, 0, 255)
    dataView.set(+1, -1, 255, 255)
    dataView.send()
    const framebuffer = scene.gl.createFramebuffer()
    if (!framebuffer) throw "Unable to create WebGL Framebuffer!"

    const dripper = {
        uniAspectRatioView: scene.gl.getUniformLocation(prgView, "uniAspectRatio"),
        uniTextureView: scene.gl.getUniformLocation(prgView, "uniTexture"),
        uniTextureBuff: scene.gl.getUniformLocation(prgBuff, "uniTexture"),
        uniY: scene.gl.getUniformLocation(prgBuff, "uniY"),
        prgView,
        prgBuff,
        texView: scene.texture.fromData(WIDTH, HEIGHT, cellularAtomata(), { linear: false }),
        texBuff: scene.texture.fromData(WIDTH, HEIGHT, cellularAtomata(), { linear: false }),
        dataView,
        framebuffer,
        y: 0
    }

    return dripper
}

function anim(
    time: number,
    scene: IScene,
    dripper: IDripper
) {
    const { gl } = scene
    scene.resize()
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.useProgram(dripper.prgView)
    gl.uniform1f(dripper.uniAspectRatioView, scene.aspectRatio)
    gl.uniform1f(dripper.uniTextureView, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, dripper.texView)
    dripper.dataView.bind()
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    // Transform image
    const fb = dripper.framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D, dripper.texBuff, 0)
    gl.viewport(0, 0, WIDTH, HEIGHT)
    gl.useProgram(dripper.prgBuff)
    gl.uniform1f(dripper.uniTextureBuff, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, dripper.texView)
    dripper.dataView.bind()
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    // Swap
    const texTmp = dripper.texView
    dripper.texView = dripper.texBuff
    dripper.texBuff = texTmp
}


function cellularAtomata(): Uint8Array {
    const size = WIDTH * HEIGHT * 4
    const data = new Uint8Array(size)
    data[WIDTH] = 255
    data[WIDTH + 2] = 255

    const RULE = "01111000"
    for (let y = 1; y < HEIGHT * 2; y++) {
        for (let x = 1; x < WIDTH * 2 - 1; x++) {
            const i = y * WIDTH + x
            const j = i - WIDTH
            const k = (data[j - 1] === 0 ? 0 : 1)
                + (data[j] === 0 ? 0 : 2)
                + (data[j + 1] === 0 ? 0 : 4)
            if (RULE.charAt(k) === '1') {
                data[i] = 255
            }
        }
    }

    // We will only keep the bottom-left corner
    // because we don't want to have big empty spaces
    // due to initial triangle generation.
    const output = new Uint8Array(WIDTH * HEIGHT * 4)
    let ptrOut = 0
    let ptrIn = size >> 1 + 1
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH - 1; x++) {
            output[ptrOut++] = data[ptrIn]
            output[ptrOut++] = data[ptrIn]
            output[ptrOut++] = data[ptrIn]
            output[ptrOut++] = data[ptrIn]
            ptrIn++
        }
        //ptrIn += WIDTH
    }

    return output
}


class Data {
    private readonly data: ArrayBuffer
    private readonly buff: WebGLBuffer
    public cursor = 0

    constructor(
        private readonly gl: WebGL2RenderingContext | WebGLRenderingContext,
        private readonly attribsCount: number
    ) {
        this.data = new ArrayBuffer(attribsCount * 8)
        const buff = gl.createBuffer()
        if (!buff) throw "Unable to create a WebGL Buffer!"

        this.buff = buff
    }

    bind() {
        const { gl, buff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
    }

    init(prg: WebGLProgram) {
        const { gl, buff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.useProgram(prg)
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attPoint'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attPoint'),
            2, gl.BYTE, false,
            8, 0
        )
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attUV'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attUV'),
            2, gl.UNSIGNED_BYTE, true,
            8, 4
        )
    }

    set(
        attPoint1: number, attPoint2: number,
        attUV1: number, attUV2: number
    ) {
        const { cursor, attribsCount } = this
        if (cursor < 0) throw "Cursor cannot be negative!"
        if (cursor >= attribsCount)
            throw `Cursor must be lesser than ${attribsCount}!`
        const view = new DataView(this.data, cursor * 8, 8)
        view.setInt8(0, attPoint1)
        view.setInt8(1, attPoint2)
        view.setUint8(4, attUV1)
        view.setUint8(5, attUV2)
        this.cursor++
    }

    send() {
        const { gl, buff, data } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
}
