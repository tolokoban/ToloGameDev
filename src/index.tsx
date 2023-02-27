import * as React from "react"
import App from "./app"
import { ModalProvider } from "@/ui/modal"
import Theme from "@/ui/theme"
import { createRoot } from "react-dom/client"
import { getDataService } from "./factory/data-service"
import { isTGDPainter } from "./guards"
import "./index.css"

async function start() {
    const theme = new Theme({
        colors: {
            input: "#eefe",
            neutral: { hue: 210, chroma: [10, 2], lightness: [20, 80] },
            primary: {
                hue: 210,
                chroma: [80, 100],
                lightness: [10, 90],
            },
            secondary: {
                hue: 72,
                chroma: [90, 100],
                lightness: [40, 75],
            },
            tertiary: {
                hue: [100, 100],
                chroma: [100, 120],
                lightness: [50, 120],
            },
        },
    })
    theme.apply()
    await initDatabase()
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(
        <ModalProvider>
            <App />
        </ModalProvider>
    )
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
