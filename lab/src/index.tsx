import Tfw from 'tfw'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'

Tfw.Theme.register("soin", {
    colorW: "#fda", colorB: "#420", colorE: "#B20",
    color0: "#ffcb97", color1: "#ffdab3", color2: "#ffe6cc", color3: "#fff3e6",
    colorP: "#804924", colorPL: "#b36633", colorPD: "#4d2c16",
    colorS: "#ff9f30", colorSD: "#ff7f00", colorSL: "#ffbf60"
})
console.log(Tfw.Theme.apply("soin"))

async function start() {
    await Tfw.Font.loadJosefin(true)
    window.addEventListener("keyup", (evt) => {
        if (evt.key === "F11") {
            evt.preventDefault()
            //const nw = window['nw'] as any
            const win = nw.Window.get()
            win.toggleFullscreen()
        }
    }, true)

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    )
}

start()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
