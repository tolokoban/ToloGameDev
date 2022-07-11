import { checkToken, parseTokens, Token } from "./lexer"

describe("wasm/program/calc/lexer.ts", () => {
    describe(`Lexer.checkToken(...)`, () => {
        const cases: Array<[token: string, ...items: string[]]> = [
            ["SPC", " ", "\t", "\r", "\n", " \t\r\n "],
            ["VAR", "$speed", "$x", "$Y", "$w45", "$x_foo"],
            ["PAR_OPEN", "("],
            ["PAR_CLOSE", ")"],
            ["ADD", "+"],
            ["SUB", "-"],
            ["MUL", "*"],
            ["DIV", "/"],
            ["MOD", "%"],
            ["AND", "&"],
            ["OR", "|"],
            ["XOR", "^"],
            ["HEX", "0x0", "0x0123456789abcdefABCDEF"],
            [
                "NUM",
                "0",
                "-0",
                "123456789.0123456789",
                "-3.14",
                "7e18",
                "7e3",
                "7e-18",
                "7e-3",
                "7.45e18",
                "7.45e3",
                "7.45e-1234567890",
                "7.45e-3",
                "-7e18",
                "-7e3",
                "-7e-18",
                "-7e-3",
            ],
        ]
        for (const [token, ...items] of cases) {
            describe(`Lexer.checkToken("${token}", ...)`, () => {
                for (const item of items) {
                    it(`should check "${item}"`, () => {
                        const got = checkToken(item, 0, token)
                        if (!got) {
                            fail(`Token "${token}" has not been recognised!`)
                        } else {
                            expect(got).toEqual(item)
                        }
                    })
                    const BEFORE = "Before#"
                    const extendedItem = `${BEFORE}${item}#After`
                    it(`should check "${extendedItem}"`, () => {
                        const got = checkToken(
                            extendedItem,
                            BEFORE.length,
                            token
                        )
                        if (!got) {
                            fail(`Token "${token}" has not been recognised!`)
                        } else {
                            expect(got).toEqual(item)
                        }
                    })
                }
            })
        }
    })
    describe("Lexer.parseTokens(...)", () => {
        const cases: Array<[string, Token[]]> = [
            [
                "$a+$b",
                [
                    ["VAR", "$a", 0],
                    ["ADD", "+", 2],
                    ["VAR", "$b", 3],
                ],
            ],
            [
                " $a + $b ",
                [
                    ["VAR", "$a", 1],
                    ["ADD", "+", 4],
                    ["VAR", "$b", 6],
                ],
            ],
            [
                "-7*($b & 0xff)",
                [
                    ["SUB", "-", 0],
                    ["NUM", "7", 1],
                    ["MUL", "*", 2],
                    ["PAR_OPEN", "(", 3],
                    ["VAR", "$b", 4],
                    ["AND", "&", 7],
                    ["HEX", "0xff", 9],
                    ["PAR_CLOSE", ")", 13],
                ],
            ],
        ]
        for (const [code, expected] of cases) {
            it(`should parse "${code}"`, () => {
                const got = parseTokens(code)
                expect(got).toEqual(expected)
            })
        }
    })
})
