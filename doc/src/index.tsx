import React from 'react'
import ReactDOM from 'react-dom'
import Scene from './view/scene'
import Font from 'tfw/font'
import Theme from 'tfw/theme'

import './index.css'

async function start() {
    Theme.register(
        "default-dark", {
        colorP: "#002ca6",
        colorS: "#FFA000",
        color0: "#123",
        color3: "#345",
        colorE: "#f44"
    })    
    Theme.apply("default-dark")
    await Font.loadJosefin(true)
    
    
    ReactDOM.render(
        <React.StrictMode>
            <Scene />
        </React.StrictMode>,
        document.getElementById('root')
    )
}

start()

