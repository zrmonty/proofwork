# Performance and representation

## Must

- Must measure equivalent before/after workloads.
- Must preserve order, failure and ownership contracts.
- Must bound allocation, retained memory and concurrent work.
- Must justify representation changes with observed costs.
- Must report variability, workload identity and limitations.
- Must reject optimizations that invalidate safety or correctness.

Read when profiling points to Rust allocation, traversal, collection, serialization, dispatch or retained-memory costs. Follow the [performance workflow](../../performance-increase/SKILL.md); Rust-specific mechanisms do not replace representative measurement.

## Find the expensive work before choosing a representation

Record the relevant workload, optimized build/profile, target, features, correctness contract and resources measured. Separate parsing, lookup, copies, synchronization and effect latency where useful, then verify the full requested path. Debug and release differences can expose arithmetic or assertion behavior; compare like builds for speed claims.

A borrowed field may save allocation while retaining a much larger source buffer. A copied short field may reduce long-lived memory. A zero-copy label is not a memory budget. Trace retained owners and peak/live bytes, including queues, caches, error records and collected results. Changing ownership needs contract checks as well as timing.

## Allocation must follow validated bounds

Use known reasonable size hints when they actually reduce repeated growth. Do not reserve from an unchecked attacker-supplied count or multiply sizes without overflow policy. Fallible reservation can represent allocation failure where the application can recover; it cannot guarantee the process handles every later allocation safely. Avoid blanket preallocation to the largest imaginable workload.

Buffer reuse can reduce work but retains capacity and creates a lifecycle owner. Bound it for the real concurrency model, avoid leaking prior-request data and preserve error cleanup. Do not share one mutable scratch buffer across independent requests just because it benchmarks well serially. Shrinking on every call can defeat reuse; choose from observed workload and memory needs.

The [Vec contract](https://doc.rust-lang.org/std/vec/struct.Vec.html) explains capacity, initialized elements and reservation behavior. Do not depend on an undocumented growth factor or use raw initialization merely to skip ordinary safe work.

## Collections change meaning and attack cost

Choose ordered sequences, maps or sets from lookup, ordering and duplicate semantics. A HashMap does not preserve a required presentation order. A set can accidentally remove legitimate equal records. Sparse IDs can make a large indexed vector wasteful. Measure input growth/skew, not just a pleasant small uniform fixture.

Changing a hasher may alter adversarial collision resistance; evaluate whether keys are controlled by an untrusted actor before accepting a faster fixture. Do not introduce a specialized crate for an unmeasured micro-operation. Reuse the incumbent collection policy where it fits.

Fusing iterations may reduce allocations but can change validation timing, selected errors and partial results. Lazy processing moves work/errors into the consumer's resource lifetime. Preserve those semantics, including numeric rounding and early exit. Functional calculations can use a private mutable builder; hiding mutation in shared caches is a different contract.

## Layout, dispatch and compiler choices

Measure enum/layout and code-size costs where a hot path or large collection makes them material. Boxing a large variant adds allocation and indirection; a borrowed representation adds lifetime constraints. Generic dispatch can specialize work but increase compilation/binary cost; dynamic dispatch may be adequate at a coarse boundary. No universal winner follows from source syntax.

Rust's default representation is not an FFI or persistent wire contract. Choose explicit serialization rather than writing struct memory to disk. Do not add packed layout or unsafe transmutation as a convenient optimization. Alignment and validity obligations belong to the unsafe reference when those mechanisms are genuinely required.

Do not change target CPU flags, panic strategy, link-time optimization or global profiles during incidental cleanup. Deployment hardware and failure policy matter; an optimization that uses instructions unavailable on supported machines changes compatibility. State exactly which profile and target produced a result.

## Confirm the claimed improvement

Preserve the input set, completed-work denominator, error behavior and resource budget. Prevent benchmark elimination with the existing harness; keep setup outside timed regions only when that matches the question. Evaluate cold/miss and warm/hit paths when applicable. Include contention and realistic in-flight limits before extrapolating a serial microbenchmark.

Retain raw distributions, not only a favorable median; compare a chosen candidate independently after exploratory tuning. Faster lookup with more failures, stale authorization, unbounded retained memory or worse end-to-end work does not satisfy the original contract. Report allocation/memory/compiler costs alongside speed when they changed.

This reference supplies decisions, not benchmark results. A build, Clippy pass or pleasing assembly listing cannot establish a user-visible performance improvement.
