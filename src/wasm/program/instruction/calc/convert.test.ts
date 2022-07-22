import { generateConvert, generateConvertInteger } from "./convert"
import { InstrCode, WasmType } from "./../../../types"
import { ToType } from "copy-webpack-plugin"

describe("wasm/program/calc/convert.ts", () => {
    // @TODO: Implement tests.
    describe("Convert.generateConvert()", () => {
        const cases: Array<
            [
                fromType: WasmType,
                ToType: WasmType,
                exp?: string,
                expAbs?: string
            ]
        > = [
            ["i32", "i32"],
            ["i32", "i64", "i64.extend_i32_s", "i64.extend_i32_u"],
            ["i32", "f32", "f32.convert_i32_s", "f32.convert_i32_u"],
            ["i32", "f64", "f64.convert_i32_s", "f64.convert_i32_u"],

            ["i64", "i32", "i32.wrap_i64", "i32.wrap_i64"],
            ["i64", "i64"],
            ["i64", "f32", "f32.convert_i64_s", "f32.convert_i64_u"],
            ["i64", "f64", "f64.convert_i64_s", "f64.convert_i64_u"],

            ["f32", "i32", "i32.trunc_f32_s", "i32.trunc_f32_u"],
            ["f32", "i64", "i64.trunc_f32_s", "i64.trunc_f32_u"],
            ["f32", "f32"],
            ["f32", "f64", "f64.promote_f32", "f64.promote_f32"],

            ["f64", "i32", "i32.trunc_f64_s", "i32.trunc_f64_u"],
            ["f64", "i64", "i64.trunc_f64_s", "i64.trunc_f64_u"],
            ["f64", "f32", "f32.demote_f64", "f32.demote_f64"],
            ["f64", "f64"],
        ]
        for (const [fromType, toType, exp, expAbs] of cases) {
            it(`should convert from "${fromType}" to "${toType}" (abs = false)`, () => {
                const code: InstrCode[] = []
                generateConvert(code, fromType, toType, false)
                const got = code.pop()
                expect(got).toEqual(exp)
            })
            it(`should convert from "${fromType}" to "${toType}" (abs = true)`, () => {
                const code: InstrCode[] = []
                generateConvert(code, fromType, toType, true)
                const got = code.pop()
                expect(got).toEqual(expAbs)
            })
        }
    })
})
