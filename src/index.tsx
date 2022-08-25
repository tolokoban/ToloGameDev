import * as React from "react"
import App from "./app"
import Modal from "@/ui/modal"
import Theme from "@/ui/theme"
import { createRoot } from "react-dom/client"
import { getDataService } from "./factory/data-service"
import { isTGDPainter } from "./guards"
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
    await Modal.wait("Initializing Database...", initDatabase())
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(<App />)
}

void start()

async function initDatabase() {
    const svc = getDataService()
    if (await svc.painter.isEmpty()) {
        console.log("Painter is empty!")
        await initPainterStorage()
    }
}

async function initPainterStorage() {
    const svc = getDataService()
    const items = ["1"]
    for (const item of items) {
        const url = `default/painter/${item}.json`
        const data = await loadJSON(url)
        console.log("🚀 [index] data = ", data) // @FIXME: Remove this line written on 2022-08-25 at 15:11
        if (isTGDPainter(data)) {
            await svc.painter.store(data)
        }
    }
}

async function loadJSON(url: string) {
    try {
        const response = await fetch(url)
        return await response.json()
    } catch (ex) {
        console.error("Bad JSON at:", url)
        console.error(ex)
        return null
    }
}
