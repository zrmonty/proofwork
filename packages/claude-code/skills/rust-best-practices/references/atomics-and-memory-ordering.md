# Atomics and concurrent protocols

Use for counters, publication, CAS, fences, atomic pointers or reclamation. The [controlled counter probe](https://github.com/zrmonty/proofwork/blob/main/evals/results/atomics-probe-20261010.md) demonstrates lost updates, not weak-memory correctness or performance.

## Separate the obligations

State the invariant, writers, observation, storage lifetime and linearization point. Name fields by domain meaning. Atomic access, indivisible compound updates, publication ordering and reclamation are different obligations. Prefer one owner, channel or lock when it expresses them more clearly. Independent atomic fields cannot transact a compound invariant, even with SeqCst.

A split load–calculate–store can lose increments; stronger ordering does not repair it. Use an appropriate RMW for independent counters. Relaxed may suffice for metrics without publication obligations; admission, completion and reference counts require their own protocol. Atomic fetch_add/sub wrap even in debug: define overflow, exhaustion and identifier-reuse policy. Checked updates must reject without changing storage.

## Ordering and publication

Follow the [Ordering contract](https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html): Relaxed is atomic without unrelated-memory publication; Release publishes prior work; Acquire consumes a qualifying publication; AcqRel combines both; SeqCst adds the common sequentially consistent order. RMW Acquire leaves its store Relaxed; Release leaves its load Relaxed. Loads permit Relaxed/Acquire/SeqCst, stores Relaxed/Release/SeqCst; invalid choices panic.

Name the exact location and write observed by Acquire. Seeing the initial value does not acquire a later Release. Explain the happens-before chain, including intervening RMW/release-sequence reasoning when used. Different locations or equal flag values do not establish that chain. Publication does not authorize overlapping ordinary payload writes or preserve lifetime. Reusable slots need generations, acknowledgment and ownership through reuse. Cancellation requested is not stopped, cleaned up or rolled back; use [async ownership](async-cancellation-and-backpressure.md).

## Conditional updates

CAS must specify expected/proposed values and both orderings. Success is RMW; failure is a load and permits Relaxed/Acquire/SeqCst, never Release/AcqRel. Failure Acquire needs a real publication dependency. Recompute from the returned observation. Weak CAS can fail spuriously; a one-shot rejection cannot assume mismatch. Strong CAS still faces contention and ABA.

Retry calculations must be pure: no messages, charges, cleanup or audit writes before commitment. [fetch_update](https://doc.rust-lang.org/std/sync/atomic/struct.AtomicUsize.html#method.fetch_update) may repeat its closure; None declines mutation. Specify retry, stale rejection, reconciliation or fallback; unbounded retries do not guarantee individual completion.

## Pointers, fences and progress

AtomicPtr supplies neither allocation ownership nor valid dereferencing. Check null, alignment, provenance, initialization, aliasing and reclamation. Equal addresses can represent different allocations (ABA). Loading a raw Arc pointer does not safely obtain ownership before reclamation. Epoch/hazard/deferred-destruction protocols must cover guards, removal, quiescence and shutdown. Tags can wrap and do not themselves prevent use-after-free. Use [unsafe invariants](unsafe-ffi-and-invariants.md), not homemade lock-free containers for speculative savings.

A [fence](https://doc.rust-lang.org/std/sync/atomic/fn.fence.html) needs connecting atomic accesses and reads-from relationships; Relaxed is invalid. compiler_fence and volatile access do not replace inter-thread synchronization. Do not layer fences over an already sufficient owner.

Available standard atomics are [lock-free, not necessarily wait-free](https://doc.rust-lang.org/std/sync/atomic/index.html#portability). Neither guarantees algorithm fairness, bounded latency or starvation freedom. Check compiler, target widths and target_has_atomic; do not invent is_lock_free queries or assume one instruction. Third-party fallbacks have separate guarantees. spin_loop is only a hint: substantial waits need the incumbent notification/blocking mechanism and shutdown owner.

## Evidence

Challenge split updates, concurrent writers, failed/spurious comparisons, exhaustion, stale proposals and shutdown with deterministic schedules. Joined final counters differ from mid-flight snapshots. [Loom](https://docs.rs/loom/latest/loom/) requires instrumented primitives and stated model bounds; desktop stress tests, Miri and sanitizers cover different failures. None alone proves every interleaving. Preserve a known-correct protocol when proof is missing. Measure contention, false sharing, retries and sharding on equivalent workloads; benchmarks cannot justify broken ordering. Report the invariant, ordering/lifetime argument, actual checks and unresolved obligations.
