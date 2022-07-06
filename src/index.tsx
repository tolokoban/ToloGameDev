import * as React from "react"
import App from "./app"
import { createRoot } from "react-dom/client"

import Essai from "./essai"

function start() {
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    // const root = createRoot(container)
    // root.render(<App />)

    Essai()
}

start()
