/**
* This file has been automatically generated
* @file translate/translate-base.ts
* @date 2021-11-17T16:29:26.884Z
*/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TranslationsConfig = require('./translations/@.json') as {
    fallback: string
    languages: string[]
}

interface ITranslation {
    [key: string]: string
}
type TranslationsLoader = (lang: string) => Promise<ITranslation>
type Translater = (id: string, ...params: string[]) => string

export interface IIntlText {
    [key: string]: string
}

export type IIntlOrString = IIntlText | string

export default class TranslateBase {
    private _lang =
        window.localStorage.getItem('lang') || navigator.language.substring(0, 2)

    public readonly $onChange = new GenericEvent<TranslateBase>()

    public get $fallbackLanguage() {
        return TranslationsConfig.fallback
    }

    public get $availableLanguages() {
        return [...TranslationsConfig.languages]
    }

    async $loadDefaultLang(lang?: string) {
        this._lang =
            lang ??
            window.localStorage.getItem('lang') ??
            window.navigator.language.substring(0, 2)
        await this._load(this._lang)
        if (this._lang !== this.$fallbackLanguage) {
            await this._load(this.$fallbackLanguage)
        }
        this.$onChange.fire(this)
    }

    public $toText(intl?: IIntlOrString, optionalLang?: string): string {
        if (!intl) return ''
        if (typeof intl === 'string') return intl
        const lang = optionalLang ?? this._lang
        const text = intl[lang]
        if (typeof text === 'string') return text
        const defaultText = intl[Object.keys(intl)[0]]
        if (typeof defaultText === 'string') return defaultText

        return ''
    }

    public $toIntl(
        text: IIntlOrString | undefined,
        optionalLang?: string
    ): IIntlText {
        const lang: string = optionalLang ?? this.$lang
        if (!text) return { [lang]: '' }
        if (Array.isArray(text)) {
            return {
                [lang]: text
                    .filter(isString)
                    .map((item: string) => `${item}`)
                    .join(''),
            }
        }
        if (typeof text === 'object') {
            const obj: { [key: string]: string } = {}
            const keys = Object.keys(text)
                .filter((key) => typeof key === 'string')
                .filter((key) => key.trim().length > 1)
            for (const key of keys) {
                obj[key] = text[key]
            }
            return obj
        }

        return { [lang]: text }
    }

    /**
     * Add a `translation` for a given `language` to a given `dictionary`.
     * @param language Language of the translation.
     * @param translation Translation to add.
     * @param dictionary Current dictionary.
     * @returns A new dictionary with the new translation.
     */
    public $addTranslation(
        language: string,
        translation: string,
        dictionary: IIntlOrString
    ): IIntlText {
        const intl = this.$toIntl(dictionary, language)
        intl[language] = translation
        const result: IIntlText = {}
        for (const key of Object.keys(intl)) {
            const val = intl[key]
            if (val.trim().length === 0) continue
            result[key] = val
        }

        return result
    }

    get $lang() {
        return this.$availableLanguages.includes(this._lang)
            ? this._lang
            : this.$fallbackLanguage
    }
    set $lang(lang: string) {
        if (!this.$availableLanguages.includes(lang)) {
            lang = this.$fallbackLanguage
        }
        window.localStorage.setItem('lang', lang)
        if (lang === this._lang) return

        this._lang = lang
        window.localStorage.setItem('lang', lang)
        this._load(lang)
            .then(() => this.$onChange.fire(this))
            .catch(console.error)
    }

    protected _: Translater = (id: string, ...params: string[]) => {
        try {
            const translations = this._allTranslations
            if (translations[this.$lang]) {
                const translation = translations[this.$lang][id]
                if (translation) return addParams(translation, params)
            }

            // If we don't find a translation in the current language,
            // We look in the other languages.
            const languages = Object.keys(translations)
            for (const lang of languages) {
                const vocabulary = translations[lang]
                const translation = vocabulary[id]
                if (typeof translation !== 'string') continue

                return addParams(translation, params)
            }

            console.error(`Missing translation for item "${id}"!`, params)

            return ''
        } catch (ex) {
            throw Error(
                `Error while looking for a translation of "${id}":
${JSON.stringify(
                    ex,
                    null,
                    '  '
                )}`
            )
        }
    }
    private _allTranslations: { [language: string]: ITranslation } = {}
    private _loaders: TranslationsLoader[] = []

    public get $() {
        return this._
    }
    protected _registerTranslationsLoader(loader: TranslationsLoader) {
        this._loaders.push(loader)
    }

    protected _unregisterTranslationsLoader(loader: TranslationsLoader) {
        this._loaders = this._loaders.filter((x) => x !== loader)
    }

    private async _load(lang: string) {
        const allTranslations = this._allTranslations
        if (typeof allTranslations[lang] === 'undefined') {
            let translations: ITranslation = {}

            for (const loader of this._loaders) {
                translations = {
                    ...translations,
                    ...(await loader(lang)),
                }
            }
            this._allTranslations[lang] = translations
        }
    }
}

// Used for the states automate in order to parse a translation
// With placeholders.
// eslint-disable-next-line no-unused-vars
enum Mode {
    Text,
    Escape,
    Placeholder,
}

/**
 * In a translation, you can find placeholders for potential params.
 * They are marked with a dollar and a digit from 1 to 9.
 * For instance: "Welcome mister $1!".
 *
 * Order doesn't matter and you can have several occurences of the same
 * placeholder.
 * For instance: "Hello $2! Welcome into $1. $1 is the best...".
 *
 * @param   translation - A string which can own placeholders.
 * @param   params - Array of replacements for placeholders.
 * @returns The transformed string.
 */
function addParams(translation: string, params: string[]): string {
    let output = ''
    let mark = 0
    let mode: Mode = Mode.Text
    let paramIndex = -1
    let paramValue = ''

    for (let index = 0; index < translation.length; index++) {
        const c = translation.charAt(index)
        switch (mode) {
            case Mode.Text:
                if (c === '\\') {
                    mode = Mode.Escape
                    output += translation.substr(mark, index - mark)
                    mark = index + 1
                } else if (c === '$') {
                    mode = Mode.Placeholder
                    output += translation.substr(mark, index - mark)
                    mark = index + '$1'.length
                }
                break
            case Mode.Escape:
                mode = Mode.Text
                break
            case Mode.Placeholder:
                mode = Mode.Text
                paramIndex = parseInt(c, 10)
                if (isNaN(paramIndex))
                    throw Error(`Parsing error at position ${index} for translation "${translation}"!
Escape "$" if you don't want to use a placeholder.`)
                paramValue = params[paramIndex - 1] || ''
                output += paramValue
                break
            default:
                mode = Mode.Text
        }
    }

    return output + translation.substr(mark)
}

/**
 * Listeners are function with only one argument of type TArgument.
 *
 * Usage example:
 * ```typescript
 * interface IPoint { x: number, y: number }
 * const onClick = new Event<IPoint>()
 * onClick.add( (point: IPoint) => ... )
 * ```
 */
class GenericEvent<TArgument> {
    private listeners: Array<(arg: TArgument) => void> = []

    /**
     * @returns How many listeners are currently registred.
     */
    public get length() {
        return this.listeners.length
    }

    /**
     * @param name Any string to be used for debug purpose.
     */
    public constructor(private readonly name: string = '') {}

    /**
     * Add a listener to this event. A listener can be added only once to an event.
     * @param listener A function that expects only one parameter of type TArgument.
     */
    public add(listener: (arg: TArgument) => void) {
        this.remove(listener)
        this.listeners.push(listener)
    }

    /**
     * Call all the listeners one after the other with <argument> as unique parameter.
     * @param argument This argument will be sent to all the listeners. Be sure it is immutable.
     */
    public readonly fire = (argument: TArgument) => {
        for (const listener of this.listeners) {
            try {
                listener(argument)
            } catch (ex) {
                console.error(`[${this.name}] Error in a listener!`)
                console.error('>  ex.: ', ex)
                console.error('>  arg.: ', argument)
            }
        }
    }

    /**
     * Remove a listener from this event.
     */
    public remove(listener: (arg: TArgument) => void) {
        this.listeners = this.listeners.filter(
            (x: (arg: TArgument) => void) => x !== listener
        )
    }

    /**
     * Remove all listeners from this event.
     */
    public removeAll() {
        this.listeners.splice(0, this.listeners.length)
    }
}

function isString(data: unknown): data is string {
    return typeof data === 'string'
}