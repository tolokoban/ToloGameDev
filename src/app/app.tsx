import * as React from "react"
import MainPage from "../view/page/main"
import Pages from "@/view/page/pages"
import PainterPage from "../view/page/painter"
import { TGDObject } from "../types"
import State from "@/state"
import "./app.css"

const PAGE_MAIN = "main"
const PAGE_PAINTER = "painter"

export default function App() {
    const [page, setPage] = React.useState(PAGE_MAIN)
    const [currentShaders, setCurrentShaders] = React.useState(0)
    const handleShadersEdit = (obj: TGDObject) => {
        setPage(PAGE_PAINTER)
        setCurrentShaders(obj.id)
    }
    return (
        <Pages page={page}>
            <MainPage key={PAGE_MAIN} onPainterEdit={handleShadersEdit} />
            <PainterPage
                key={PAGE_PAINTER}
                id={currentShaders}
                onClose={() => setPage(PAGE_MAIN)}
            />
        </Pages>
    )
}
