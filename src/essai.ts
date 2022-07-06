class Program {
    func(name: string, instr: Instruction<"void">): Instruction<"func"> {
        return {
            type: "func",
            code: [`(func $${name}`, [this.$getLocals(), instr], ")"],
        }
    }

    test(local: string): Instruction<"void"> {
        this.$declareLocal(local, "i32")
        return {
            type: "void",
            code: `local.get $${local}_i32`,
        }
    }
}

export default function () {
    const p = new Program()
    console.log(makeSourceCode(p.func("main", p.test("counter"))))
}
