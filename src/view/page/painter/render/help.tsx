import * as React from "react"

export function renderHelp() {
    return (
        <>
            <hr />
            <div className="help">
                <div>The following uniforms have special meanings:</div>
                <br />
                <div className="uniforms-grid">
                    <code>float uniTime</code>
                    <div>Current time in milliseconds.</div>
                    <code>vec4 uniPointer</code>
                    <div>
                        <code>uniPointer.x</code>: X coord of the pointer
                        between -1 and +1.
                        <br />
                        <code>uniPointer.y</code>: Y coord of the pointer
                        between -1 and +1.
                        <br />
                        <code>uniPointer.z</code>: Pointer pressure between 0
                        and +1 (0 if no touch).
                        <br />
                    </div>
                    <code>float uniAspectRatio</code>
                    <div>Width of the screen divided by its height.</div>
                    <code>float uniInverseAspectRatio</code>
                    <div>Height of the screen divided by its Width.</div>
                    <code>vec2 uniAspectRatioCover</code>
                    <div>
                        Multiply it to <code>gl_Position.xy</code> to ensure
                        aspect ratio.
                        <br />
                        No point outside [-1, +1] will be in the viewport.
                        <br />
                        Some points inside [-1, +1] can be out of the viewport.
                    </div>
                    <code>vec2 uniAspectRatioContain</code>
                    <div>
                        Multiply it to <code>gl_Position.xy</code> to ensure
                        aspect ratio.
                        <br />
                        All points inside [-1, +1] will be in the viewport.
                        <br />
                        Some points outside [-1, +1] will be in the viewport.
                    </div>
                    <code>float uniVertexCount</code>
                    <div>Number of displayed vertices.</div>
                    <code>float uniElementCount</code>
                    <div>Number of displayed elements.</div>
                    <code>float uniInstanceCount</code>
                    <div>Number of displayed instances.</div>
                </div>
            </div>
        </>
    )
}
