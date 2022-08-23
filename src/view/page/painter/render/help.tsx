import * as React from "react"

export function renderHelp() {
    return (
        <div className="help">
            <p>The following uniforms have special meanings:</p>
            <div className="uniforms-grid">
                <code>float uniTime</code>
                <div>Current time in milliseconds.</div>
                <code>float uniAspectRatio</code>
                <div>Width of the screen divided by its height.</div>
                <code>float uniInverseAspectRatio</code>
                <div>Height of the screen divided by its Width.</div>
                <code>vec2 uniAspectRatioCover</code>
                <div>
                    Multiply it to <code>gl_Position.xy</code> to ensure aspect
                    ratio.
                    <br />
                    No point outside [-1, +1] will be in the viewport.
                    <br />
                    Some points inside [-1, +1] can be out of the viewport.
                </div>
                <code>vec2 uniAspectRatioCotain</code>
                <div>
                    Multiply it to <code>gl_Position.xy</code> to ensure aspect
                    ratio.
                    <br />
                    All points inside [-1, +1] will be in the viewport.
                    <br />
                    Some points outside [-1, +1] will be in the viewport.
                </div>
            </div>
        </div>
    )
}
