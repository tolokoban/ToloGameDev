/**
 * This editor helps you generate the right code to deal
 * with your attributes.
 */
import * as React from "react"
import Button from 'tfw/view/button'
import Checkbox from 'tfw/view/checkbox'
import Combo from "tfw/view/combo"
import Icon from 'tfw/view/icon'
import Input from "tfw/view/input"
import InputInteger from "tfw/view/input-integer"
import Storage from 'tfw/storage'

import './attributes-editor-view.css'


const LocalStorage = new Storage.PrefixedLocalStorage("view/attributes-editor")

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

export interface IAttributesEditorViewProps {
    className?: string
    onChange?(attributes: IAttribute[]): void
}

interface IAttributesEditorViewState {
    attributes: IAttribute[]
    attribute: IAttribute
}

export default class AttributesEditorView extends React.Component<IAttributesEditorViewProps, IAttributesEditorViewState> {
    state: IAttributesEditorViewState = {
        attributes: LocalStorage.get("attributes", []) as IAttribute[],
        attribute: LocalStorage.get("attribute", {
            name: "attPoint", type: "FLOAT", size: 4, normalized: false
        }) as IAttribute
    }

    componentDidMount() {
        this.fire(this.state.attributes)
    }

    private readonly handleAddAttribute = () => {
        const { attribute, attributes } = this.state
        attribute.name = attribute.name.trim()
        const newAttributes = [
            ...attributes.filter(
                att => att.name !== attribute.name
            ),
            { ...attribute }
        ]
        this.setState({
            attributes: newAttributes
        })
        LocalStorage.set("attribute", attribute)
        this.fire(newAttributes)
    }

    private fire(attributes: IAttribute[]) {
        const { onChange } = this.props
        LocalStorage.set("attributes", attributes)
        if (typeof onChange === "function") {
            onChange(attributes)
        }
    }

    private select(name: string) {
        const attribute = this.state.attributes.find(
            att => att.name === name
        )
        if (!attribute) return

        this.setState({
            attribute: { ...attribute }
        })
    }

    private remove(name: string) {
        const { attributes } = this.state
        const newAttributes = attributes.filter(
            att => att.name !== name
        )
        this.setState({
            attributes: newAttributes
        })
        this.fire(newAttributes)
    }

    render() {
        const { attribute, attributes } = this.state
        const classNames = [
            'custom',
            'view-AttributesEditorView',
            'thm-ele-button',
            'thm-bg1'
        ]
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <div className="edit">
                <Input
                    label="Attribute's Name"
                    value={attribute.name}
                    onChange={name => this.setState({
                        attribute: { ...attribute, name }
                    })}
                />
                <Combo
                    label="Attribute's Type"
                    value={attribute.type}
                    onChange={type => this.setState({
                        attribute: { ...attribute, type: type as IAttributeType }
                    })}
                >
                    <div key="BYTE">
                        <b>BYTE</b>: integer within [-128, 127]
                        </div>
                    <div key="SHORT">
                        <b>SHORT</b>: integer within [-32768, 32767]
                        </div>
                    <div key="UNSIGNED_BYTE">
                        <b>UNSIGNED_BYTE</b>: integer within [0, 255]
                        </div>
                    <div key="UNSIGNED_SHORT">
                        <b>UNSIGNED_SHORT</b>: integer within [0, 65535]
                        </div>
                    <div key="FLOAT">
                        <b>FLOAT</b>: 32-bits IEEE floating point number
                        </div>
                    <div key="HALF_FLOAT">
                        <b>HALF_FLOAT</b>: 16-bits IEEE number (only WebGL2)
                        </div>
                </Combo>
                <div className="flex">
                    <InputInteger
                        label="Size"
                        min={1}
                        max={4}
                        size={1}
                        width="4rem"
                        value={attribute.size}
                        onChange={size => this.setState({
                            attribute: { ...attribute, size }
                        })}
                    />
                    <Checkbox
                        label="Normalized?"
                        value={attribute.normalized}
                        onChange={normalized => this.setState({
                            attribute: { ...attribute, normalized }
                        })}
                    />
                    <Button
                        width="auto"
                        icon="add"
                        label="Add"
                        enabled={attribute.name.trim().length > 0}
                        onClick={this.handleAddAttribute}
                    />
                </div>
            </div>
            <hr />
            <table className="list">
                <thead>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Nor.</th>
                </thead>
                <tbody>
                    {
                        attributes.map(attribute =>
                            <tr key={attribute.name} className="thm-bg2">
                                <td>
                                    <Button
                                        width="auto"
                                        flat={true}
                                        color="PD"
                                        label={attribute.name}
                                        onClick={() => this.select(attribute.name)}
                                    />
                                </td>
                                <td>{
                                    `${attribute.type}[${attribute.size}]`
                                }</td>
                                <td className="small">
                                    {
                                        attribute.normalized ?
                                            <b>Yes</b> :
                                            <span className="no">No</span>
                                    }
                                </td>
                                <td className="small">
                                    <Button
                                        icon="delete"
                                        small={true}
                                        onClick={() => this.remove(attribute.name)}
                                    />
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div >
    }
}
