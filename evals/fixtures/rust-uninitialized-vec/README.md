# Uninitialized Vec under Miri

`broken` reserves capacity, sets length without writing elements and then reads the uninitialized bytes.
That violates [Vec::set_len](https://doc.rust-lang.org/std/vec/struct.Vec.html#method.set_len).
Its invalid code is compiled only under Miri; a native invocation refuses to execute it.

`fixed` writes four values through `spare_capacity_mut()` before setting length. Its safety comment explains
initialized prefix, capacity and exclusive ownership. Ordinary application code should prefer a safe constructor
or push/extend; the unsafe repair is here to make the obligation inspectable.

```sh
cargo +nightly miri run --manifest-path evals/fixtures/rust-uninitialized-vec/Cargo.toml --target x86_64-unknown-linux-gnu --example broken
cargo +nightly miri run --manifest-path evals/fixtures/rust-uninitialized-vec/Cargo.toml --target x86_64-unknown-linux-gnu --example fixed
```

The first command must fail specifically for an uninitialized read; a download/build failure is not a successful
negative test. The second must pass with initialized_prefix=4 sum=100. Pin the recorded nightly when reproducing
historical evidence; Miri needs its component and rust-src. These are small execution probes, not a proof of every
unsafe path or Rust's entire aliasing model. See [Miri](https://github.com/rust-lang/miri) for target support and limits.

Observed on October 10, 2026: nightly 2026-10-10, rustc 1.101.0-nightly (32dba69d6),
Miri 0.1.0 (32dba69d69), Linux interpreted target from a Windows host. `broken` exited 1 with
an Undefined Behavior diagnosis for reading uninitialized memory; `fixed` exited 0 and printed
initialized_prefix=4 sum=100. Native formatting and Clippy with warnings denied also passed.
The nightly toolchain was installed alongside stable; the default remained stable 1.95.0.
