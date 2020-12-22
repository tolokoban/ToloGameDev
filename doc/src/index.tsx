import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import Font from 'tfw/font'
import Theme from 'tfw/theme'

import './index.css'

async function start() {
    Theme.register(
        "default-dark", {
        colorP: "#28F",
        colorS: "#F90",
        color0: "#CCC",
        color3: "#FFF",
        colorE: "#F44"
    })
    Theme.apply("default-dark")
    await Font.loadIndieFlower(true)
    await Font.loadJosefin(true)

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    )
}

start()

