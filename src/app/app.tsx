import * as React from "react"
import MainPage from "../view/page/main"
import Pages from "@/view/page/pages"
import ShaderPage from "../view/page/painter"
import { TGDObject, TGDPainter } from "../types"
import "./app.css"

const PAGE_MAIN = "main"
const PAGE_PAINTER = "painter"

export default function App() {
    const [page, setPage] = React.useState(PAGE_MAIN)
    const [currentShaders, setCurrentShaders] = React.useState(0)
    const handleShadersEdit = (obj: TGDObject) => {
        setPage(PAGE_PAINTER)
        setCurrentShaders(obj.id)
        console.log("🚀 [app] obj = ", obj) // @FIXME: Remove this line written on 2022-08-15 at 13:54
    }
    return (
        <Pages page={page}>
            <MainPage key={PAGE_MAIN} onPainterEdit={handleShadersEdit} />
            <ShaderPage
                key={PAGE_PAINTER}
                id={currentShaders}
                onClose={() => setPage(PAGE_MAIN)}
            />
        </Pages>
    )
}
