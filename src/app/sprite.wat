(module
    (import "env" "buffer" (memory 1))
    (func $go
      i32.const 27
      i32.const 42
      i32.store
      (i32.rem_u)
    )
    (export "go" (func $go))
)
