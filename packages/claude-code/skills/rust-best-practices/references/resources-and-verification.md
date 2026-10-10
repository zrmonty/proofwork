# Resources and verification

## Make resource lifetime match the operation

Use the project's ownership/RAII patterns to bound files, buffers, guards, and subscriptions. Automatic dropping helps release resources, but a business operation may still need an explicit flush, commit, rollback, or close result. Do not assume destruction proves persistence succeeded.

When a parser lends references into a buffer, document which owner keeps that buffer alive. For streaming input, decide when iteration errors occur and who finishes or drops the stream. Do not return an iterator that silently swallows failures to keep its item type convenient.

Avoid cloning a large value solely to escape a broad borrow. First ask whether the borrow scope can shrink or immutable observation can happen before mutation. Clone when two actors truly need independent ownership, and explain material cost only when relevant.

## Concurrency is a state contract

Before choosing Arc/Mutex, channels, or tasks, state the invariant requiring coordination. Independent owned work is easier to reason about than a shared mutable accumulator. If sharing is needed, identify which state the lock protects, its acquisition order, and whether callbacks or blocking work can run while held.

Keep a synchronous guard's scope visible. Avoid holding it across suspension unless the runtime and contract support that choice. Snapshot, release, perform I/O, and reacquire can reduce lock duration, but it creates a race: compare a version or recheck the condition before committing a decision based on the snapshot.

Mutex poisoning is a signal that an invariant may have been interrupted. Do not blanket-unwrap locks or blindly recover the inner value. Determine whether the protected invariant can be validated/restored; use the repository's established recovery policy. [Standard Mutex documentation](https://doc.rust-lang.org/std/sync/struct.Mutex.html) explains poisoning behavior and its limits.

Task cancellation and dropping a future depend on the API involved. Read the runtime and operation's cancellation contract before claiming an operation is safe to select, retry, or abandon. Dropping a future cannot be assumed to undo remote writes. Track partial completion or use the existing idempotency mechanism when the outcome can be unknown.

`Arc` shares ownership; it does not add synchronization to its contents or make a non-thread-safe inner value thread-safe. Its clone also does not copy the inner value. Trace interior mutability and the actual `Send`/`Sync` requirements when moving data into tasks. Prefer an owned message or immutable snapshot where it removes the need for shared mutation. See [Arc's thread-safety contract](https://doc.rust-lang.org/std/sync/struct.Arc.html).

Moving blocking work off an async executor does not establish that cancelling the waiting task stops the underlying operation. Check the runtime's blocking-task contract, bound submitted work and give ongoing operations an owner through shutdown. A timeout must not allow a worker to keep mutating a resource that the caller has already reused or removed.

A timeout test that only observes “the task stopped” is insufficient for a resource claim. Verify relevant handles/locks are released and the externally visible state satisfies the operation's documented partial-effect policy.

## Unsafe review is an invariant audit

For every unsafe block or implementation, identify the requirement and its evidence: valid address/alignment, initialized values, bounds, aliasing, lifetime, thread safety, and applicable provenance rules. Distinguish facts established by private code from preconditions imposed on callers. Keep safe APIs from accepting values that break those requirements.

Do not use an unsafe operation to avoid a small safe check without a demonstrated need. A comment repeating “safe because valid” supplies no evidence. Explain which constructor, bounds check, ownership restriction, or synchronization enforces validity. Recheck after changing layout, lifetimes, or concurrency even when the unsafe line itself is unchanged.

Use applicable tools such as Miri only when available and appropriate to the touched code; record coverage and limitations. Neither a successful test nor a reviewer assertion establishes soundness by itself. [The Rustonomicon](https://doc.rust-lang.org/nomicon/) provides technical grounding for unfamiliar unsafe obligations.

## Verification follows supported consumers

Start with the package and affected feature combinations. A library with optional adapters needs their relevant builds; testing default features alone does not prove them. Conversely, blindly enabling all features can be invalid when the project supports mutually exclusive configurations.

Run the existing formatting/Clippy/test policy. Do not alter lint levels to make the check green or impose a new global policy during a local change. For a public signature, use an actual downstream call or compile test. For numeric policy, test the boundary on the chosen representation. For resource/concurrency behavior, inspect failures and interleavings as well as success.

Record the compiler, target/features exercised, commands and results, and remaining checks. A snippet compiled on a newer machine does not establish the project's minimum supported compiler version.
