import React from 'react'
import ReactDOM from 'react-dom'
//import Scene from './view/scene'
import Intro from './page/intro'
import Font from 'tfw/font'
import Theme from 'tfw/theme'

import './index.css'

async function start() {
    Theme.register(
        "default-dark", {
        colorP: "#06d",
        colorS: "#FFA000",
        color0: "#ccc",
        color3: "#fff",
        colorE: "#f44"
    })    
    Theme.apply("default-dark")
    await Font.loadJosefin(true)
    
    
    ReactDOM.render(
        <React.StrictMode>
            <Intro />
        </React.StrictMode>,
        document.getElementById('root')
    )
}

start()

