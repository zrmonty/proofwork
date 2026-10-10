# Controlled Rust atomic-counter probe — 2026-10-10

This is an originally authored deterministic concurrency regression probe. It motivates explicit atomic-update and overflow guidance in Proofwork's [atomics reference](../../shared/skills/rust-best-practices/references/atomics-and-memory-ordering.md). It is not an agent comparison, performance benchmark, or proof of an arbitrary atomic protocol's soundness.

## Contract and controlled failure

Two workers each increment one shared count exactly once. After both workers join, the count must be two. The initial implementation used an atomic load followed by an atomic store, with Relaxed ordering on both. A two-participant barrier after each load forced both workers to read zero before either stored one. This is a defined concurrent execution; every shared counter access was atomic.

The actual red run exited unsuccessfully with **two tests passing and one failing**, and printed `expected_count=2 actual_count=1`. The failing assertion compared one with the required two. The barrier made the lost update deterministic without sleeps or timing thresholds.

The repaired operation waits at the same barrier and then uses `fetch_add(1, Ordering::Relaxed)`. This makes each increment a read-modify-write operation. Relaxed is adequate for this fixture because the counter does not publish other state and the final observation occurs after both workers join. This does not imply Relaxed is adequate for completion flags or other application protocols.

## Observed results

| Check | Actual result |
| --- | --- |
| Red split load/store update | Final count 1; expected 2; one failing assertion |
| Green read-modify-write update, debug | Final count 2; all 3 tests pass |
| Green read-modify-write update, release | Final count 2; all 3 tests pass |
| Checked update at `usize::MAX` | Returns `Err(usize::MAX)` and leaves stored value unchanged |
| Checked update from 7 | Returns `Ok(7)` and stores 8 |
| `cargo fmt -- --check` | Pass |
| Clippy, all targets, warnings denied | Pass |

The bounded update uses `fetch_update` with a pure `checked_add` closure and Relaxed success/failure orderings. Its two tests challenge both the successful transition and exhausted transition. They do not force a compare-and-exchange retry, spurious failure or overflow under contending writers.

## Reproduction material

The ignored local fixture is `.engineering-team/atomics-probe`, with no third-party dependencies, edition 2024 and `publish = false`. The successful source operation is:

```rust
use std::sync::Barrier;
use std::sync::atomic::{AtomicUsize, Ordering};

pub fn increment_under_controlled_schedule(counter: &AtomicUsize, observations_complete: &Barrier) {
    observations_complete.wait();
    counter.fetch_add(1, Ordering::Relaxed);
}

pub fn increment_without_wrap(counter: &AtomicUsize) -> Result<usize, usize> {
    counter.fetch_update(Ordering::Relaxed, Ordering::Relaxed, |current_count| {
        current_count.checked_add(1)
    })
}
```

The failing operation differed only in its increment implementation: load the old count before waiting at the barrier, then store the old count plus one after the barrier. The assertion and two-worker schedule remained the same.

The decisive test is:

```rust
#[test]
fn simultaneous_observations_do_not_lose_an_increment() {
    let counter = AtomicUsize::new(0);
    let observations_complete = Barrier::new(2);
    thread::scope(|scope| {
        for _ in 0..2 {
            scope.spawn(|| increment_under_controlled_schedule(&counter, &observations_complete));
        }
    });
    let final_count = counter.load(Ordering::Relaxed);
    println!("expected_count=2 actual_count={final_count}");
    assert_eq!(final_count, 2);
}
```

The integration test imports those two library functions, `AtomicUsize`, `Ordering`, `Barrier` and `std::thread`. It additionally asserts overflow rejection without mutation and successful previous-value return as listed above. No unsafe code is used.

Executed from the repository root:

```text
cargo test --offline --manifest-path .engineering-team/atomics-probe/Cargo.toml -- --nocapture
cargo fmt --manifest-path .engineering-team/atomics-probe/Cargo.toml
cargo fmt --manifest-path .engineering-team/atomics-probe/Cargo.toml -- --check
cargo clippy --offline --manifest-path .engineering-team/atomics-probe/Cargo.toml --all-targets -- -D warnings
cargo test --offline --manifest-path .engineering-team/atomics-probe/Cargo.toml -- --nocapture
cargo test --offline --release --manifest-path .engineering-team/atomics-probe/Cargo.toml -- --nocapture
```

The first test command was run against the red implementation; the subsequent checks ran against the repair. One initially mistyped formatter manifest path failed before formatting; the corrected command above and its explicit check subsequently passed. The red output is retained in ignored `red.log`.

Successful fixture SHA-256 identities:

- `src/lib.rs`: `28140FD547899F594C896E722660C1021A978192B349AA68D464FEE7B954A06E`
- `tests/contracts.rs`: `FEF2DA0B0934789FAE188F627BF7BA53BE88F9937C9B404B85EB70A75904DE6C`

## Environment and limits

Compiler: `rustc 1.95.0 (59807616e 2026-04-14)`. Cargo: `cargo 1.95.0 (f2d3ce0bd 2026-03-21)`. Host: `x86_64-pc-windows-msvc`; LLVM 22.1.2. Debug and release configurations were checked offline. No toolchain, global setting or dependency was installed for the probe.

Official online documentation checked on 2026-10-10 identifies standard library version 1.99.0. The installed 1.95.0 compiler's bundled `AtomicUsize` documentation was also inspected for compare-and-exchange failure orderings, wrapping arithmetic and retryable update closures. The fixture verifies the used APIs on the installed compiler; it does not certify other minimum compiler versions or targets. Current documentation's generic `Atomic<T>` presentation is not a recommendation to use a nightly-only API.

Not exercised: release/acquire publication, weak-memory hardware, pointer reclamation, ABA, fences, invalid-ordering panics, spin-loop progress or real application throughput. No Loom, Miri, sanitizer or numerical Rust coverage run was performed. The probe does not measure whether an agent makes better decisions after reading the skill.
