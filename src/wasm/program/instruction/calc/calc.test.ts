import Calc from "./calc"
import Program from "../.."
import { MemoryArray, WasmType } from "./../../../types"

type Case = [
    code: string,
    expected: number,
    extra?: {
        memory?: { [name: string]: MemoryArray }
        i32?: { [name: string]: number }
        i64?: { [name: string]: number }
        f32?: { [name: string]: number }
        f64?: { [name: string]: number }
    }
]

describe("wasm/program/instruction/calc/calc.ts", () => {
    const CASES: Case[] = [
        ["5 + 3", 8],
        ["5 - 3", 2],
        ["5 * 3", 15],
        [
            `@[2]`,
            3.14,
            { memory: { main: new Float32Array([0, 1, 3.14, 666]) } },
        ],
        [
            `@more[2]`,
            22,
            {
                memory: {
                    main: new Float32Array(7),
                    empty: new Uint8ClampedArray(3),
                    more: new Uint8ClampedArray([0, 11, 22, 33, 44]),
                },
            },
        ],
        [
            `@more[2 - @more[1]]`,
            1,
            {
                memory: {
                    main: new Float32Array(7),
                    empty: new Uint8ClampedArray(3),
                    more: new Uint8ClampedArray([0, 1, 2, 3, 4]),
                },
            },
        ],
        [
            `@more[2 + $index]`,
            4,
            {
                memory: {
                    main: new Float32Array(7),
                    empty: new Uint8ClampedArray(3),
                    more: new Uint8ClampedArray([0, 1, 2, 3, 4]),
                },
                i32: { index: 2 },
            },
        ],
        [
            "$x > -3.2",
            1,
            {
                f32: { x: -3.14 },
            },
        ],
    ]
    describe("Calc expressions f32", () => {
        for (const [code, expected, extra] of CASES) {
            it(`should get ${expected} from "${code}"`, async () => {
                const p = new Program({ memory: extra?.memory })
                const build = await p.compile(
                    p.flow.module(
                        p.flow.func.f32(
                            {},
                            ...declareLocalsI32(p, extra?.i32),
                            ...declareLocalsI64(p, extra?.i64),
                            ...declareLocalsF32(p, extra?.f32),
                            ...declareLocalsF64(p, extra?.f64),
                            p.calc.f32(code)
                        )
                    )
                )
                expect(build.main()).toBeCloseTo(expected, 6)
            })
        }
    })
})

function declareLocalsF32(
    p: Program,
    f32: { [name: string]: number } | undefined
) {
    if (!f32) return []

    return Object.keys(f32).map((name) => p.set.f32(name, f32[name]))
}

function declareLocalsF64(
    p: Program,
    f64: { [name: string]: number } | undefined
) {
    if (!f64) return []

    return Object.keys(f64).map((name) => p.set.f64(name, f64[name]))
}

function declareLocalsI32(
    p: Program,
    i32: { [name: string]: number } | undefined
) {
    if (!i32) return []

    return Object.keys(i32).map((name) => p.set.i32(name, i32[name]))
}

function declareLocalsI64(
    p: Program,
    i64: { [name: string]: number } | undefined
) {
    if (!i64) return []

    return Object.keys(i64).map((name) => p.set.i64(name, i64[name]))
}
