# Reservation contract fixture

This commits the originally authored fixture previously executed only under `.engineering-team/rust-depth`.
It proposes a new inventory value and notification without mutating the caller. Its eight integration tests cover
ordinary/exact stock, zero units, insufficient stock, revision overflow, error precedence, deterministic replay
and a stale proposal rejected before issuing effects.

```sh
cargo test --offline --manifest-path evals/fixtures/rust-reservation/Cargo.toml
cargo test --offline --release --manifest-path evals/fixtures/rust-reservation/Cargo.toml
cargo clippy --offline --manifest-path evals/fixtures/rust-reservation/Cargo.toml --all-targets -- -D warnings
cargo fmt --manifest-path evals/fixtures/rust-reservation/Cargo.toml -- --check
```

All four checks were executed successfully on Rust 1.95.0, Windows MSVC, edition 2021. No dependencies.
The sequential in-memory commit adapter demonstrates the version/effect contract; it is not a database transaction,
durable outbox, concurrent stress test or unforgeable capability. Public teaching proposal fields are forgeable.
