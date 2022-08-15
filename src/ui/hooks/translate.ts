import * as React from "react"
import Translate from "../../translate"

Translate.$loadDefaultLang()

/**
 * Updated everytime the language changes.
 */
export function useTranslate() {
    const [_currentLanguage, setCurrentLanguage] = React.useState(
        Translate.$lang
    )
    React.useEffect(() => {
        const handle = () => setCurrentLanguage(Translate.$lang)
        Translate.$onChange.add(handle)
        return () => Translate.$onChange.remove(handle)
    }, [])
    return Translate
}
