/**
 * This file has been automatically generated
 * @file translate/translate.ts
 * @date 2021-11-17T16:29:26.884Z
 */
import TranslateBase from './translate-base'

export class AppTranslations extends TranslateBase {
    constructor() {
        super()
        this._registerTranslationsLoader(
            async (lang: string): Promise<{ [key: string]: string }> => {
                switch (lang) {
                    case "en": return (await import('./translations/lang-en')).default
                    case "fr": return (await import('./translations/lang-fr')).default
                    case "it": return (await import('./translations/lang-it')).default
                    default: return {}
                }
            }
        )
    }

    get anonymousTrace() { return this._("anonymous-trace") }
    get badLogin() { return this._("bad-login") }
    get cancel() { return this._("cancel") }
    get changePassword() { return this._("change-password") }
    get close() { return this._("close") }
    get createAccount() { return this._("create-account") }
    get day1() { return this._("day-1") }
    get day2() { return this._("day-2") }
    get day3() { return this._("day-3") }
    get day4() { return this._("day-4") }
    get day5() { return this._("day-5") }
    get day6() { return this._("day-6") }
    get day7() { return this._("day-7") }
    get emailAddress() { return this._("email-address") }
    get emailSent() { return this._("email-sent") }
    get emailUsageDisclaimer() { return this._("email-usage-disclaimer") }
    get errorContactSupport() { return this._("error-contact-support") }
    get errorGpsPermissionDenied() { return this._("error-gps-permission-denied") }
    get errorNicknameExists() { return this._("error-nickname-exists") }
    get errorUnknown() { return this._("error-unknown") }
    get errorWrongPassword() { return this._("error-wrong-password") }
    get file() { return this._("file") }
    get forgotPassword() { return this._("forgot-password") }
    get gotIt() { return this._("got-it") }
    get invalidEmail() { return this._("invalid-email") }
    get language() { return this._("language") }
    get lat() { return this._("lat") }
    get level() { return this._("level") }
    get level0() { return this._("level-0") }
    get level1() { return this._("level-1") }
    get level2() { return this._("level-2") }
    get level3() { return this._("level-3") }
    get level4() { return this._("level-4") }
    get level5() { return this._("level-5") }
    get level6() { return this._("level-6") }
    get lng() { return this._("lng") }
    get location() { return this._("location") }
    get login() { return this._("login") }
    get logout() { return this._("logout") }
    get mapFilter() { return this._("map-filter") }
    get mapLayer() { return this._("map-layer") }
    get missingEmail() { return this._("missing-email") }
    get month1() { return this._("month-1") }
    get month10() { return this._("month-10") }
    get month11() { return this._("month-11") }
    get month12() { return this._("month-12") }
    get month2() { return this._("month-2") }
    get month3() { return this._("month-3") }
    get month4() { return this._("month-4") }
    get month5() { return this._("month-5") }
    get month6() { return this._("month-6") }
    get month7() { return this._("month-7") }
    get month8() { return this._("month-8") }
    get month9() { return this._("month-9") }
    get newPassword() { return this._("new-password") }
    get newPasswordRepeat() { return this._("new-password-repeat") }
    get nickname() { return this._("nickname") }
    get noMatch() { return this._("no-match") }
    get ok() { return this._("ok") }
    get oldPassword() { return this._("old-password") }
    get onlyMyTraces() { return this._("only-my-traces") }
    get password() { return this._("password") }
    get passwordTooShort() { return this._("password-too-short") }
    get personalSpace() { return this._("personal-space") }
    get place() { return this._("place") }
    get remove() { return this._("remove") }
    get rgpd() { return this._("rgpd") }
    get save() { return this._("save") }
    get seeMore() { return this._("see-more") }
    get selectLanguage() { return this._("select-language") }
    get sport() { return this._("sport") }
    get sport0() { return this._("sport-0") }
    get sport1() { return this._("sport-1") }
    get sport10() { return this._("sport-10") }
    get sport11() { return this._("sport-11") }
    get sport12() { return this._("sport-12") }
    get sport2() { return this._("sport-2") }
    get sport3() { return this._("sport-3") }
    get sport4() { return this._("sport-4") }
    get sport5() { return this._("sport-5") }
    get sport6() { return this._("sport-6") }
    get sport7() { return this._("sport-7") }
    get sport8() { return this._("sport-8") }
    get sport9() { return this._("sport-9") }
    get timeBarrier() { return this._("time-barrier") }
    get traceGroup() { return this._("trace-group") }
    get traceId() { return this._("trace-id") }
    get traceName() { return this._("trace-name") }
    get unknown() { return this._("unknown") }
    get userIsNotGranted() { return this._("user-is-not-granted") }
}

export default new AppTranslations()
