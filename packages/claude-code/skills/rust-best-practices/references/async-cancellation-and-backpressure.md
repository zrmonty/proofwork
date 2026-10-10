# Async ownership, cancellation and backpressure

Use this reference when changed Rust work can suspend, spawn tasks, stream input, coordinate shared state or continue after its caller stops waiting. Keep the existing runtime and its supported version. Async syntax does not supply a resource limit, transactional rollback or a shutdown policy.

## Write the operation contract before choosing primitives

Identify the owner of inputs, task handles, output buffers, admission capacity and final observations. Distinguish work that has not started, work admitted locally, an effect possibly submitted externally and an observed durable outcome. Specify what timeout, caller cancellation, process shutdown and task failure mean in each state.

Choose the least machinery that meets the contract: a borrowed future awaited by its caller, a bounded collection of independent futures, a single state owner receiving messages, or shared state with a narrow lock. Spawning is useful when work needs independent scheduling or lifetime; it is not required merely because operations are concurrent.

Keep policy calculations pure: eligibility, retry deadlines, next states, capacity decisions and response classification consume explicit observations. The adapter owns polling, acquiring capacity, I/O and commits. Cancellation is an observation to interpret, not proof that an effect did not occur.

## Separate lifetime, mobility and synchronization

A future can borrow inputs while it remains within their lifetime. Awaiting it directly need not require owned `'static` data. A runtime's spawn API may impose stronger requirements because the task can outlive the current stack or move between threads. Read that exact API rather than cloning everything until compilation succeeds.

`Send` permits a value to move between threads; `'static` excludes borrowed references with shorter lifetimes. Neither implies the other. An owned value satisfying `'static` can still be dropped promptly. `async move` moves captures into the future, but moving a borrowed reference does not extend the referent's lifetime. A future's `Send` requirement depends on what it retains across suspension, including guards and captured values.

If the project uses Tokio, [`spawn`](https://docs.rs/tokio/latest/tokio/task/fn.spawn.html) requires a `Send + 'static` future and output. A local-task API can support non-`Send` work within its own lifetime/runtime rules; it does not make arbitrary borrowed captures valid. Do not change runtimes or introduce leaked allocations to satisfy these bounds.

Use `Arc` for shared ownership only when multiple owners are necessary. It does not make its contents immutable or synchronized. When an immutable snapshot removes cross-task coordination, prefer that to an `Arc<Mutex<_>>` wrapping the entire operation.

## Audit each suspension against partial progress

For each relevant `.await`, ask what has already changed, who remembers progress and whether dropping and recreating the future preserves the intended behavior. Keep durable progress or resumable buffers with the surviving owner when interruption must not erase them. Do not infer cancellation safety from a function returning `Result`.

For framed I/O, partial bytes are protocol state. If a receive is interrupted after consuming a prefix, restarting a fresh decoder against the same stream can corrupt framing. Preserve the decoder and buffer across waits, or close the connection and reconnect according to the protocol. Likewise, restarting a partially completed write from byte zero can duplicate a prefix; decide whether to resume with known progress, discard the connection or reconcile at the application boundary.

In Tokio, the [`select!` cancellation contract](https://docs.rs/tokio/latest/tokio/macro.select.html#cancellation-safety) distinguishes operations such as `read` from `read_exact` and `write` from `write_all`. Check the project's operation/version before racing it against a timeout. A safe primitive does not automatically make a multi-step wrapper safe. Losing fairness-queue position differs from losing bytes but can still cause starvation under repeated cancellation.

Selecting an error-shaped result is still a completed branch. Handle errors and exhausted inputs explicitly; do not use pattern mismatch to silently discard a failed operation. If branch ordering is biased, justify how shutdown and lower-volume sources remain observable under continuously ready traffic.

Dropping an owned future can release its local fields; it cannot retract bytes already sent, database commits or a request accepted by another system. Distinguish cancellation of waiting, cancellation requested of the task, confirmed task termination and confirmed external outcome.

## Own tasks until their consequences are resolved

Keep the task handle or equivalent supervision record where the operation's lifetime belongs. Decide how success, domain failure, panic and cancellation are observed. A result containing another `Result` has two distinct failure layers; report both accurately rather than flattening a panic into a domain rejection.

With Tokio, dropping a [`JoinHandle`](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html) detaches the task. Calling abort requests cancellation; observing its completion establishes a stronger local fact. Neither certifies rollback of completed external effects. A timeout around a moved handle must not silently discard the only owner able to observe continuing work.

For an uncertain payment, upload finalization or remote job submission, preserve the same operation identity when reconciling or retrying that intent. Use actual provider lookup/idempotency guarantees. If neither exists, expose possible duplicate effects and choose the required policy; a generic retry loop cannot manufacture exactly-once delivery.

## Bound admission, work and retained results

A bounded channel limits messages in that channel, not tasks spawned before sending, buffers held by blocked senders or completed outputs awaiting collection. Identify each accumulation point: queued inputs, admitted tasks, in-flight requests, retry backlog and retained output bytes. Bound the resources that matter using existing project mechanisms.

Acquire admission before starting expensive work. Keep the capacity token with the actual work until it finishes or relinquishes the resource. If the caller times out but a blocking worker continues, releasing the caller's token early can admit more work than the intended limit. Do not create one waiting task per input solely to wait for a semaphore.

Specify overload behavior: wait with an applicable deadline, reject, spill through an existing durable mechanism, or coalesce only when intermediate values are dispensable. Dropping an old telemetry sample can be acceptable; dropping a financial command usually is not. Queue capacity needs input-size and latency assumptions, not an unexplained magic number.

For Tokio channels, inspect the [`mpsc` backpressure and shutdown contract](https://docs.rs/tokio/latest/tokio/sync/mpsc/index.html). Closing admission and draining accepted items are separate steps. Track outstanding permits, sender clones and retry producers that may prevent termination. A channel send succeeding proves local acceptance, not execution or durable success.

## Shared state must remain valid while the lock is absent

Use short synchronous locks for short non-suspending critical sections where they fit the runtime. An async lock can be appropriate for genuinely shared asynchronous resources, but holding it across slow I/O serializes users and can make cancellation leave application state half-updated. Document the protected invariant and contention rather than applying a blanket “all locks are wrong” rule.

Capture explicit policy and the required state revision, calculate a candidate without hidden shared reads, then commit with the incumbent version check or owner mechanism. Release a lock before I/O when possible, but recognize that reacquisition alone does not validate an earlier snapshot. Re-read and recompute when the revision or relevant authorization changes. Never issue the rejected candidate's effects.

Do not call user callbacks while holding an internal lock unless their reentrancy, blocking and acquisition contract is controlled. Record lock order for multi-lock operations. A timeout around lock acquisition does not fix a cycle among locks or a task that blocks the executor.

## Blocking work and shutdown need a surviving owner

Use the project's established blocking boundary for synchronous I/O or substantial CPU work; an `async fn` containing a long synchronous operation still blocks its polling thread. Bound queued and running blocking work according to its resource cost. Do not add a parallelism crate without an observed requirement.

Tokio's [`spawn_blocking`](https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html) cannot abort a started closure, and a runtime shutdown timeout stops waiting without stopping that work. Design cooperative stopping where the underlying operation supports it, or retain ownership until completion. Do not reuse/delete its file, connection or output path just because the waiting async task timed out.

Plan shutdown from dependency edges: stop admission and retry producers; notify owners; finish, safely interrupt or persist accepted work; observe remaining tasks; then flush/close dependent resources through their fallible APIs. The exact order follows who needs whom, not a universal checklist. Define what survives a deadline and who will reconcile it after restart.

## Worked decisions and acceptance probes

- **Upload timeout:** three chunks may already be accepted. Preserve session identity and authoritative offset if the protocol supports resuming. Otherwise discard/reconcile according to its actual contract; do not send the full body again while calling the first upload cancelled. Test interruption after a prefix and after acceptance before acknowledgment.
- **Search index rebuild:** cancellation occurs while a blocking worker writes a new index. Keep its capacity and output ownership until it stops; publish only a verified completed artifact. Test that cancelling the waiter neither admits unbounded rebuilds nor exposes the partial index.
- **Inventory reservation:** two tasks decide from revision 12. Only the successful version-checked commit may emit its reservation effect; the losing task re-reads and recomputes. Test a conflict emits no stale effect and a late response cannot overwrite a newer reservation state.
- **Bursting pipeline:** producers are faster than consumers. Bound admission before spawning, then challenge the limit with large messages and slow consumers. Measure queued bytes, active work and retained output rather than reporting channel length as total memory.
- **Shutdown during heavy traffic:** verify new work is rejected, accepted work follows the chosen drain/persist policy and shutdown remains observable. Hold a sender clone or a blocking operation open to test the actual deadline behavior and unresolved ownership report.

Use deterministic barriers, controllable adapters or the existing runtime's test tools to reach these interleavings; arbitrary sleeps are weak evidence. Assert externally visible effects and resource ownership alongside returned errors. Run only applicable probes and record what remains untested. Compile checks establish bounds/types, not scheduling, remote idempotency or shutdown correctness.
