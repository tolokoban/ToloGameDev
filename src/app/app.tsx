import * as React from "react"
import MainPage from "../view/page/main"
import Pages from "@/view/page/pages"
import ShaderPage from "../view/page/shader"
import { TGDObject, TGDShaders } from "../types"
import "./app.css"

const PAGE_MAIN = "main"
const PAGE_SHADER = "shader"

export default function App() {
    const [page, setPage] = React.useState(PAGE_MAIN)
    const [currentShaders, setCurrentShaders] = React.useState(0)
    const handleShadersEdit = (obj: TGDObject) => {
        setPage(PAGE_SHADER)
        setCurrentShaders(obj.id)
        console.log("🚀 [app] obj = ", obj) // @FIXME: Remove this line written on 2022-08-15 at 13:54
    }
    return (
        <Pages page={page}>
            <MainPage key={PAGE_MAIN} onShadersEdit={handleShadersEdit} />
            <ShaderPage
                key={PAGE_SHADER}
                id={currentShaders}
                onClose={() => setPage(PAGE_MAIN)}
            />
        </Pages>
    )
}
