import * as React from "react"
import { createId } from "../factory/id"

export function useRefId(prefix?: string) {
    return React.useRef(createId(prefix))
}
