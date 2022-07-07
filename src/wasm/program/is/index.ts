import Different from "./different"
import Equal from "./equal"
import Greater from "./greater"
import GreaterOrEqual from "./greater-or-equal"
import Lesser from "./lesser"
import LesserOrEqual from "./lesser-or-equal"
import Negative from "./negative"
import Positive from "./positive"
import Zero from "./zero"

export default class Is {
    readonly different = new Different()
    readonly equal = new Equal()
    readonly greater = new Greater()
    readonly greaterOrEqual = new GreaterOrEqual()
    readonly lesser = new Lesser()
    readonly lesserOrEqual = new LesserOrEqual()
    readonly negative = new Negative()
    readonly positive = new Positive()
    readonly zero = new Zero()
}
