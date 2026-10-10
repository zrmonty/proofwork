# Atomics, ordering and concurrent state

Load this reference when Rust changes involve atomic fields, counters, publication flags, compare-and-exchange, fences, spin loops, raw atomic pointers or concurrent reclamation. Read the existing protocol and its callers before replacing its synchronization. An atomic primitive can be correct while the surrounding operation loses updates, exposes inconsistent state or frees a value too soon.

The motivating [controlled counter probe](https://github.com/zrmonty/proofwork/blob/main/evals/results/atomics-probe-20261010.md) exposed a lost increment despite every access being atomic. The guidance below addresses that failure and the distinct obligations it does not test. Do not turn that probe into evidence of weak-memory correctness or improved agent performance.

## Start with the invariant and ownership

Write what must remain true, which actor may change it, when another actor can observe it, and when its storage can be destroyed. Name atomic fields for their domain meaning: `completed_jobs`, `published_revision`, `shutdown_requested`. Avoid names such as `flag2` or `sync_value` that hide the protocol.

Separate four questions in the review:

1. Is each conflicting access valid and atomic where required?
2. Is a multi-step update indivisible where the domain requires it?
3. Which observation orders which earlier writes before which later reads?
4. Who keeps the value alive while readers use it?

Passing one question does not answer the next. A larger ordering cannot fix a split update or an ownership hole. State the supported writer count and whether a publication slot is single-use or reusable; reuse introduces generation, overwrite and acknowledgment obligations.

Choose a single state owner, channel or narrow lock when that makes the contract visible. A [Mutex](https://doc.rust-lang.org/std/sync/struct.Mutex.html) can protect several fields through one guard; document its lock scope and panic policy. Do not replace it with atomics merely because the word “lock-free” sounds faster.

Keep domain calculations pure. The effect boundary reads current state, attempts the atomic change, and records its actual result. A failed compare-and-exchange is a new observation; recompute a proposal from it instead of committing a stale proposal blindly.

## Atomicity does not make load–calculate–store one operation

For a counter whose only invariant is retaining each increment, use an appropriate read-modify-write operation. Separate atomic `load` and `store` allow two callers to read the same old count and overwrite each other's changes. `SeqCst` on both operations still leaves the update split.

The probe forced both callers to observe zero before either stored its increment: the expected final count was two, but the split update produced one. Replacing the update with `fetch_add` retained both increments with Relaxed ordering. The barrier controlled a schedule; it did not test publication ordering.

An independent metric can often use Relaxed updates because no unrelated data depends on reading it. An admission count, completion flag or reference count can have additional ordering and lifecycle obligations. Describe these before reusing a metrics-counter pattern.

Independent atomic fields do not preserve a compound invariant such as `reserved <= available` across separate updates. Even a sequentially consistent reader can observe an intermediate combination. Use one guarded transition, a proven representation with one atomic commit, or a vetted protocol that explicitly tolerates intermediate observations.

## Select ordering from an explained relationship

Use the [Ordering contract](https://doc.rust-lang.org/std/sync/atomic/enum.Ordering.html) to describe the relationship needed by the operation:

| Ordering | Obligation to explain |
| --- | --- |
| Relaxed | The value needs atomic access, but this access does not publish unrelated memory. |
| Release | Prior work must become visible through a qualifying observation of this publication. |
| Acquire | Later work depends on acquiring a qualifying publication that this operation observes. |
| AcqRel | This read-modify-write both acquires earlier publication and releases preceding work. |
| SeqCst | The protocol additionally relies on the common order of sequentially consistent operations. |

On a read-modify-write, Acquire leaves its store half Relaxed; Release leaves its load half Relaxed. AcqRel supplies both halves. Sequential consistency supplies stronger ordering, not a transaction across several addresses.

Select an ordering legal for the actual method. An atomic load accepts Relaxed, Acquire or SeqCst and panics for Release or AcqRel; a store accepts Relaxed, Release or SeqCst and panics for Acquire or AcqRel. A public wrapper that accepts arbitrary ordering input must validate its supported combinations or expose an API that prevents invalid ones. These are method contracts, not compiler errors to assume away.

Do not prescribe Relaxed everywhere to save imagined cycles, or SeqCst everywhere to avoid explaining the protocol. When reasoning is uncertain, preserve a known-correct implementation or use a simpler synchronization owner. Any ordering reduction must preserve the invariant and its proof; measured speed alone cannot justify it.

The [Rustonomicon's atomics discussion](https://doc.rust-lang.org/nomicon/atomics.html) explains why compiler and processor behavior both matter. Successful execution on one desktop does not establish that a weaker ordering is valid on other targets. Avoid explanations based only on what a particular processor “usually does.”

## Publication must identify the observation

For release/acquire publication, identify the exact atomic location and the write read by the acquiring operation. An acquire load that sees the initial value does not acquire a later release merely because the writer eventually executes it. Equal flag values from multiple publications are not proof of which publication was observed.

Describe the happens-before chain from payload initialization, through publication, to the reader's use. Include any intervening read-modify-write operations and release-sequence reasoning if the existing protocol relies on them. Different atomic locations do not automatically create this chain.

For a safe application-level publication, prefer the project's channel, lock or one-time initialization abstraction. A flag plus ordinary mutable payload often needs unsafe interior storage and a complete protocol; do not supply a toy `UnsafeCell` wrapper as production guidance.

An acquire observation does not permit a writer to mutate the same ordinary payload while a reader uses it, and it does not keep that payload alive. Reusable slots need a complete ownership and acknowledgment cycle. Pointer publication must also address replacement and reclamation.

For cancellation flags, state what reading the flag actually promises. “Stop requested” does not mean a task stopped, cleanup completed, or external effects rolled back. Use an observed completion mechanism for those claims; see [task ownership and cancellation](async-cancellation-and-backpressure.md).

## Compare-and-exchange is a conditional transition

Record the expected value, proposed next value, success ordering, failure ordering, and what callers do with the returned observation. A successful operation returns the previous value; a failed comparison returns an observed value rather than applying the proposal.

Success ordering applies to the read-modify-write; failure ordering applies to a load. Failure must therefore use Relaxed, Acquire or SeqCst. Release and AcqRel are invalid failure orderings. Choose failure Acquire only when consuming that failed observation must acquire published data; arithmetic retries alone do not require it.

`compare_exchange_weak` may fail spuriously even when the expected value matches. A retry loop must treat that outcome as retryable according to its contract. Do not use a one-shot weak operation where spurious failure would incorrectly reject a valid action. Strong compare-and-exchange removes spurious comparison failure, but not competing writers or ABA.

Use returned observations as the next attempt's input, and calculate the proposal again. Retry functions must not send messages, charge customers, release resources, append audit events or mutate external state while merely computing a candidate. An eventual successful update does not imply its candidate was computed once.

Consult the [atomic operation methods](https://doc.rust-lang.org/std/sync/atomic/struct.Atomic.html) and the project's compiler documentation. In particular, `fetch_update` can invoke its closure again; `None` declines the update. Its successful mutation is one atomic operation, not a critical section around the closure.

Choose a domain policy for contention: retry, reject a stale request, reconcile or fall back to an incumbent lock. An unbounded retry loop does not guarantee that this caller completes. Do not add arbitrary retry counts that silently drop required work.

## Arithmetic needs a domain overflow policy

`fetch_add` and `fetch_sub` wrap on integer overflow. Debug-mode overflow checking does not turn them into checked arithmetic. Before using them for identifiers, inventory, debt or capacity, decide whether wrapping is valid.

For a bounded count, a pure checked calculation inside the incumbent compare-and-exchange/update pattern can decline overflow without mutation. Return an explicit exhausted outcome and test the unchanged stored value. Do not compute `old + increment` with unchecked arithmetic inside the retry closure.

For sequence identifiers, consider uniqueness lifetime, restart behavior and eventual exhaustion. A wraparound sequence can make an old identifier appear current. Saturation avoids wrapping but can conceal events; use it only when that loss is acceptable and visible.

An atomic machine-width integer is not automatically a suitable money or quantity representation. Select units and bounds from the domain before selecting atomic storage. See [numeric contracts](numeric-and-float-contracts.md).

## Pointer equality is not ownership or identity

`AtomicPtr` atomically stores and compares a pointer value. It does not allocate, retain, validate or safely dereference its pointee. An address that compares equal may refer to a different allocation after removal and reuse: the ABA problem.

Review null handling, alignment, provenance, initialization, allowed aliasing, reachable field synchronization and the lifetime of every returned pointer. A successful CAS does not establish all these properties. `Arc` ownership elsewhere is insufficient if the loaded raw pointer can be reclaimed before a reader obtains a valid owner.

For reclamation, require an established protocol whose contract covers the actual access path: epochs, hazard protection, deferred destruction or another vetted ownership scheme. Registration, guard scope, removal, quiescence, callbacks and shutdown belong to that protocol. A version tag may detect some reuse; it does not by itself prevent use-after-free, and finite tags can wrap.

Avoid homemade unsafe lock-free containers to eliminate an unmeasured lock cost. Reuse the repository's proven abstraction or a safe lock. If implementing a concurrent primitive is the actual task, obtain a specialist soundness review and model the lifetime and ordering protocol together. See [unsafe invariants](unsafe-ffi-and-invariants.md).

## Fences require a connecting protocol

A fence is not a command to make every thread see every write immediately. Explain the atomic access connecting the publishing side and consuming side, the reads-from relationship, and which surrounding accesses the fence orders. An unrelated fence cannot rescue a missing ownership or access discipline.

Use the [fence API](https://doc.rust-lang.org/std/sync/atomic/fn.fence.html) for the exact fence-to-fence, fence-to-atomic or atomic-to-fence relationship the incumbent protocol needs. Relaxed is invalid for `fence`. Prefer direct release/acquire operations when they express the contract more clearly; do not add fences speculatively around all reads.

`compiler_fence` is not a substitute for inter-thread processor synchronization. Volatile access concerns observable accesses, not ordinary thread coordination. A channel or mutex may already provide the required ordering; do not layer a custom atomic protocol over it without a demonstrated requirement.

## Progress, availability and cost are separate

Rust's [atomic module portability contract](https://doc.rust-lang.org/std/sync/atomic/index.html#portability) guarantees that available standard atomic types are lock-free, but does not guarantee wait-free operations. At the algorithm level, lock-free progress allows an individual caller to keep losing retries while other operations advance; wait-free progress requires a bounded completion argument for each operation. A primitive's lock-free implementation does not make an entire algorithm wait-free, starvation-free or bounded in latency.

Check the exact compiler, target and supported atomic widths, including `target_has_atomic`. Pointer-width atomics and wide integers are not universally available. Compile supported targets and feature combinations rather than relying on the development machine; avoid promising a portable fallback that was never built.

Do not invent `is_lock_free` queries or assume an atomic operation is one processor instruction. Some operations may require internal retry loops. Third-party fallback atomics have their own contracts and must not inherit the standard library's guarantees by name alone.

Busy waiting consumes execution capacity and can obstruct an async runtime. [spin_loop](https://doc.rust-lang.org/std/hint/fn.spin_loop.html) is a processor hint, not a scheduling, synchronization or fairness guarantee. When waiting may be substantial, use the incumbent blocking/notification mechanism and its shutdown contract.

Treat cache contention, false sharing and the cost of retries as measurable hypotheses. A single global atomic can bottleneck independent workers; sharding changes aggregation and observation semantics. Compare equivalent workloads and report before/after latency, throughput, contention and retained memory where relevant. No benchmark proves ordering correctness.

## Evidence required before changing a protocol

For a changed atomic operation, record the invariant, its linearization point when applicable, publication relationship, storage lifetime, retry/effect policy and overflow policy. Explain how callers interpret successful, rejected and uncertain outcomes.

Use deterministic schedules to expose split updates and stale proposals. Check zero work, concurrent writers, saturation/exhaustion, failed comparisons, repeated observations and shutdown according to the supported contract. A counter result after joining threads is stronger than a mid-flight snapshot; do not compare the two as equivalent.

Where appropriate and available, use a concurrency model checker such as [Loom](https://docs.rs/loom/latest/loom/) with its instrumented synchronization types. State the modeled state space and limits. Ordinary repeated tests on one target, Miri, sanitizers and a model checker have different detection capabilities; none alone certifies every interleaving or unsafe caller.

Keep the final claim proportional to the evidence: “the forced lost-update schedule now retains both increments” is supported by the probe. “all atomics are sound,” “weak-memory safe,” “wait-free” and “faster” require independent justification.
