import * as React from "react"
import App from "./app"
import Theme from "@/ui/theme"
import { createRoot } from "react-dom/client"
import "./index.css"

async function start() {
    await Theme.apply({
        colors: {
            accent: {
                dark: "hsl(30, 90%, 40%)",
                base: "hsl(30, 80%, 60%)",
                light: "hsl(30, 100%, 75%)",
            },
            primary: {
                dark: "hsl(210, 80%, 50%)",
                base: "hsl(210, 70%, 70%)",
                light: "hsl(210, 100%, 80%)",
            },
            black: "#000d",
            white: "#fffd",
            error: "#f30",
            screen: "hsl(210, 50%, 20%)",
            frame: "hsl(210, 50%, 30%)",
            section: "hsl(210, 50%, 40%)",
            input: "hsl(210, 20%, 80%)",
        },
    })
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(<App />)
}

void start()
