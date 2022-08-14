import * as React from "react"
import App from "./app"
import Editor from "./view/editor"
import { createRoot } from "react-dom/client"

function start() {
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    // root.render(<App />)
    root.render(<Editor value={`Hello world\nof infamous\npeople!`} />)
}

start()
