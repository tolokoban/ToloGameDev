(module
  (import "env" "mem" (memory 1))
  (func $main (param $count i32)
    (local $accu_i32 i32) (local $loop_i32 i32)
    i32.const 0
    (local.set $accu_i32)
    local.get $count
    (local.set $loop_i32)
    (block $block_1
      (local.get $loop_i32)
      i32.const 0
      i32.gt_s
      br_if $block_1
      local.get $accu_i32
      (local.get $loop_i32)
      i32.sub
      local.tee $accu_i32
      local.get $loop_i32
      i32.const 1
      i32.sub
      local.tee $loop_i32
    )
    (local.get $accu_i32)
  )
  (export "main" (func $main))
)