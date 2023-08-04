import AtomicState from "@tolokoban/react-state"
import { isString } from "@tolokoban/type-guards"

export default {
    page: new AtomicState("main"),
    pages: {
        painter: {
            section: new AtomicState("data", {
                storage: {
                    id: "painter/section",
                    guard: isString,
                },
            }),
        },
    },
}
