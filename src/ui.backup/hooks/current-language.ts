import * as React from "react"
import Translate from "../../translate"

interface Translator {
    $loadDefaultLang(lang?: string): Promise<void>
}

export function useCurrentLanguage(
    ...translators: Translator[]
): [currentLanguage: string, setCurrentLanguage: (lang: string) => void] {
    const [loading, setLoading] = React.useState(false)
    const [currentLanguage, setCurrentLanguage] = React.useState(
        Translate.$lang
    )
    React.useEffect(() => {
        const handle = () => setCurrentLanguage(Translate.$lang)
        Translate.$onChange.add(handle)
        return () => Translate.$onChange.remove(handle)
    }, [])
    React.useEffect(() => {
        const action = async () => {
            setLoading(true)
            console.log("loading...", currentLanguage)
            for (const translator of translators) {
                await translator.$loadDefaultLang(currentLanguage)
            }
            setLoading(false)
        }
        void action()
    }, [currentLanguage])
    return [currentLanguage, setCurrentLanguage]
}
