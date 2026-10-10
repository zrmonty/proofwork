# Executed async cancellation fixtures

These original fixtures use Tokio 1.53.1, pinned in `Cargo.toml` and `Cargo.lock`.
Run from the repository root:

```sh
cargo test --locked --manifest-path evals/fixtures/rust-async/Cargo.toml
cargo test --release --locked --manifest-path evals/fixtures/rust-async/Cargo.toml
cargo clippy --locked --manifest-path evals/fixtures/rust-async/Cargo.toml --all-targets -- -D warnings
cargo fmt --manifest-path evals/fixtures/rust-async/Cargo.toml --check
```

## Partial reads lose framing when restarted

`tests/cancellation.rs` supplies two frames, `AB` and `CD`. A controlled `AsyncRead`
returns `A`, then parks. A biased `select!` polls the read first and then selects an
interrupt branch only after the prefix has been consumed. No timer or random
branch ordering decides the interleaving.

Dropping that `read_exact` future and starting another two-byte read produces
`BC`, crossing the frame boundary. The normal suite asserts this observed failure.
The intentionally broken regression asserts the desired `AB` frame:

```sh
cargo test --locked --manifest-path evals/fixtures/rust-async/Cargo.toml broken_restart_preserves_frame -- --ignored --exact
```

This command was executed and exited **101**, with actual `[66, 67]` (`BC`) versus
expected `[65, 66]` (`AB`). It is ignored during the normal green suite on purpose.

The fix creates and pins the future outside `select!`, borrows it in the branch,
then awaits that same future after the interruption. Its internal progress survives
and both frames remain `AB`, `CD`. This fix applies when the competing event should
pause the operation; if cancellation must terminate it, preserve parser progress
outside the cancelled future or close the connection instead of restarting blindly.
Tokio documents that [`read_exact` is not cancellation safe](https://docs.rs/tokio/1.53.1/tokio/io/trait.AsyncReadExt.html#method.read_exact).

## A timed-out waiter does not stop blocking work

`tests/blocking.rs` waits for a start handshake before timing out the borrowed
`JoinHandle`. The closure stays blocked on its explicit release channel after the
waiter times out and after `abort()`. The test then releases and joins the closure,
which returns successfully. Every wait and the closure's release receive are
bounded, so a failed assertion cannot leave a permanently blocked worker.

The timeout proves control-flow behavior, not a performance benchmark. Tokio
documents that [started `spawn_blocking` tasks cannot be aborted](https://docs.rs/tokio/1.53.1/tokio/task/fn.spawn_blocking.html).
Production callers need a cooperative cancellation mechanism or an external
process when stopping the underlying work is required.

## Verification record

Executed on Windows with Rust/Cargo 1.95.0: debug and release suites each passed
three tests with one intentional ignored regression; Clippy with warnings denied
and the formatting check passed. The explicit ignored regression failed as
described above. These examples establish these interleavings, not universal
coverage of networking, runtime shutdown or application cancellation policy.
