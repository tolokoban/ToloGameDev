import * as React from "react"
import AttributesEditor from '../../view/attributes-editor'
import CodeView from '../../view/code'

import './attributes-tool.css'


type IAttributeType =
    | "BYTE"
    | "SHORT"
    | "UNSIGNED_BYTE"
    | "UNSIGNED_SHORT"
    | "FLOAT"
    | "HALF_FLOAT"
interface IAttribute {
    name: string
    type: IAttributeType
    size: number
    normalized: boolean
}

export interface IAttributesToolProps {
    className?: string
}

interface IAttributesToolState {
    attributes: IAttribute[]
    classCode: string
}

export default class AttributesTool extends React.Component<IAttributesToolProps, IAttributesToolState> {
    state: IAttributesToolState = {
        attributes: [],
        classCode: ""
    }

    private readonly handleChange = (attributes: IAttribute[]) => {
        this.setState({
            attributes,
            classCode: generateClassCode(attributes)
        })
    }

    render() {
        const { classCode } = this.state
        const classNames = [
            'custom',
            'tool-AttributesTool',
            'thm-ele-header',
            'thm-bg0'
        ]
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <AttributesEditor
                onChange={this.handleChange}
            />
            <CodeView
                lang="ts"
                content={classCode}
            />
        </div>
    }
}


function generateClassCode(attributes: IAttribute[]): string {
    let attributeLengthInBytes = 0
    for (const att of attributes) {
        attributeLengthInBytes += getLength(att)
    }


    return `class Data {
    private readonly data: ArrayBuffer
    private readonly buff: WebGLBuffer
    public cursor = 0

    constructor(
        private readonly gl: WebGL2RenderingContext | WebGLRenderingContext,
        private readonly attribsCount: number
    ) {
        this.data = new ArrayBuffer(attribsCount * ${attributeLengthInBytes})
        const buff = gl.createBuffer()
        if (!buff) throw "Unable to create a WebGL Buffer!"

        this.buff = buff
    }

    initVertexAttribPointer(prg: WebGLProgram) {
        const { gl, buff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.useProgram(prg)
        ${generateVertexAttribPointer(attributes, "        ")}
    }

    set(
        ${generateSetParams(attributes, "        ")}
    ) {
        const { cursor, attribsCount } = this
        if (cursor < 0) throw "Cursor cannot be negative!"
        if (cursor >= attribsCount )
            throw \`Cursor must be lesser than \${attribsCount}!\`
        const view = new DataView(this.data, cursor * ${attributeLengthInBytes}, ${attributeLengthInBytes})
        ${generateSetValues(attributes, "        ")}
        this.cursor++
    }

    sendToGPU() {
        const { gl, buff, data } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
}\n`
}

function generateVertexAttribPointer(attributes: IAttribute[], indent: string): string {
    let code = ""
    let offset = 0
    let stride = 0
    for (const att of attributes) {
        stride += getLength(att)
    }
    for (const att of attributes) {
        code += `${indent}gl.enableVertexAttribArray(\n`
        code += `${indent}    gl.getAttribLocation(prg, 'attColor'))\n`
        code += `${indent}gl.vertexAttribPointer(
${indent}    gl.getAttribLocation(prg, '${att.name}'),
${indent}    ${att.size}, gl.${att.type}, ${att.normalized},
${indent}    ${stride}, ${offset}
${indent})\n`
        offset += getLength(att)
    }

    return code.trim()
}

function generateSetParams(attributes: IAttribute[], indent: string): string {
    return attributes.map(att => {
        if (att.size === 1) return `${att.name}: number`

        const args: string[] = []
        for (let i = 1; i <= att.size; i++) {
            args.push(`${att.name}${i}: number`)
        }

        return args.join(`, `)
    }).join(`,\n${indent}`).trimRight()
}

function generateSetValues(attributes: IAttribute[], indent: string): string {
    const lines: string[] = []
    let offset = 0
    for (const att of attributes) {
        if (att.size === 1) {
            lines.push(
                `view.set${getViewType(att.type, offset, att.name)}`
            )
        } else {
            const typeLen = getTypeLen(att)
            for (let i = 1; i <= att.size; i++) {
                lines.push(
                    `view.set${getViewType(
                        att.type,
                        offset + (i - 1) * typeLen,
                        `${att.name}${i}`
                    )}`
                )
            }
        }
        offset += getLength(att)
    }

    return lines.join(`\n${indent}`).trim()
}

function getViewType(type: IAttributeType, offset: number, name: string): string {
    switch (type) {
        case "BYTE": return `Int8(${offset}, ${name})`
        case "FLOAT": return `Float32(${offset}, ${name}, true)`
        case "HALF_FLOAT": return `Float16(${offset}, ${name}, true)`
        case "SHORT": return `Int16(${offset}, ${name}, true)`
        case "UNSIGNED_BYTE": return `Uint8(${offset}, ${name})`
        case "UNSIGNED_SHORT": return `Uint16(${offset}, ${name}, true)`
        default: return "ERROR"
    }
}

function getTypeLen(attribute: IAttribute): number {
    switch (attribute.type) {
        case "UNSIGNED_BYTE":
        case "BYTE":
            return 1
        case "FLOAT":
            return 4
        case "SHORT":
        case "UNSIGNED_SHORT":
        case "HALF_FLOAT":
            return 2
        default: throw `Unknown type: "${attribute.type}"!`
    }
}

function getAlignedSize(attribute: IAttribute): number {
    const size = attribute.size
    switch (attribute.type) {
        case "UNSIGNED_BYTE":
        case "BYTE":
            return 4
        case "FLOAT":
            return size
        case "SHORT":
        case "UNSIGNED_SHORT":
        case "HALF_FLOAT":
            return Math.ceil(size * 0.5) * 2
        default: throw `Unknown type: "${attribute.type}"!`
    }
}


function getLength(attribute: IAttribute): number {
    const size = getAlignedSize(attribute)
    switch (attribute.type) {
        case "BYTE": return size
        case "FLOAT": return size * 4
        case "HALF_FLOAT": return size * 2
        case "SHORT": return size * 2
        case "UNSIGNED_BYTE": return size
        case "UNSIGNED_SHORT": return size * 2
        default: throw `Unknown type: "${attribute.type}"!`
    }
}
