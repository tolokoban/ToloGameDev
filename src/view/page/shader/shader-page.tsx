import * as React from "react"
import Button from "@/ui/view/button"
import CodeEditor from "@/view/code-editor"
import debouncer from "../../../tools/async/debouncer"
import Flex from "@/ui/view/flex"
import IconCancel from "@/ui/view/icons/cancel"
import IconDelete from "@/ui/view/icons/delete"
import IconSave from "@/ui/view/icons/export"
import InputInteger from "@/ui/view/input/integer"
import InputText from "@/ui/view/input/text"
import Modal from "@/ui/modal"
import Runnable from "@/ui/view/runnable"
import ShadersCompiler from "@/tools/webgl/shaders-compiler"
import { DEFAULT_SHADERS } from "@/constants"
import { makeDataService } from "@/factory/data-service"
import { TGDShaders } from "@/types"
import "./shader-page.css"

export interface ShaderPageProps {
    className?: string
    id: number
    onClose(this: void): void
}

export default function ShaderPage(props: ShaderPageProps) {
    const refCompiler = React.useRef(new ShadersCompiler())
    const [error, setError] = React.useState<null | string>(null)
    const [busy, setBusy] = React.useState(true)
    const [shaders, setShaders] = React.useState<TGDShaders>(DEFAULT_SHADERS)
    const compile = debouncer(() => {
        setError(refCompiler.current.compile(shaders))
    }, 500)
    const update = (value: Partial<TGDShaders>) => {
        setShaders({ ...shaders, ...value })
        void compile()
    }
    React.useEffect(() => {
        if (props.id === 0) {
            setBusy(false)
            return
        }
        setBusy(true)
        makeDataService()
            .shaders.get(props.id)
            .then((value) => {
                setBusy(false)
                if (value) setShaders(value)
            })
            .catch((ex) => console.error(ex))
    }, [props.id])
    const handleCancel = async () => {
        const confirm = await Modal.confirm(
            "You are about to revert all the changes you made for these shaders"
        )
        if (confirm) props.onClose()
    }

    const handleSave = async () => {
        const svc = makeDataService()
        await Modal.wait("Saving...", svc.shaders.update(shaders))
        props.onClose()
    }
    return (
        <Runnable running={busy}>
            <div className={getClassNames(props)}>
                <header>
                    <Flex>
                        <Button
                            color="accent"
                            label="Save"
                            enabled={error === null}
                            icon={IconSave}
                            onClick={handleSave}
                        />
                        <Button
                            flat={true}
                            label="Cancel"
                            icon={IconCancel}
                            onClick={handleCancel}
                        />
                    </Flex>
                    <InputText
                        label={`Shaders name (#${shaders.id})`}
                        value={shaders.name}
                        onChange={(value) => (shaders.name = value)}
                    />
                    <Button color="accent" label="Delete" icon={IconDelete} />
                </header>
                <main>
                    <div>
                        <h1>Preview</h1>
                        <canvas className="theme-shadow-header"></canvas>
                        <h1>Data</h1>
                        <Flex wrap="wrap">
                            <InputInteger
                                label="Vertices"
                                size={4}
                                value={shaders.vertexCount ?? 0}
                                onChange={(vertexCount) =>
                                    update({ vertexCount })
                                }
                            />
                            <InputInteger
                                label="Elements"
                                size={4}
                                value={shaders.elementCount ?? 0}
                                onChange={(elementCount) =>
                                    update({ elementCount })
                                }
                            />
                            <InputInteger
                                label="Instances"
                                size={4}
                                value={shaders.instanceCount ?? 0}
                                onChange={(instanceCount) =>
                                    update({ instanceCount })
                                }
                            />
                        </Flex>
                    </div>
                    <div>
                        <h1>Vertex Shader</h1>
                        <CodeEditor
                            language="glsl"
                            value={shaders.vertexShader}
                            onChange={(vertexShader) =>
                                update({ vertexShader })
                            }
                        />
                        <h1>Fragment Shader</h1>
                        <CodeEditor
                            language="glsl"
                            value={shaders.fragmentShader}
                            onChange={(fragmentShader) =>
                                update({ fragmentShader })
                            }
                        />
                    </div>
                    {error && <pre className="theme-color-error">{error}</pre>}
                </main>
            </div>
        </Runnable>
    )
}

function getClassNames(props: ShaderPageProps): string {
    const classNames = ["custom", "view-page-ShaderPage"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
