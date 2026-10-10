# Async ownership and bounded work

Use the existing runtime and supported version. Before spawning, identify ownership of inputs, handles, buffers, capacity and final observations. Distinguish unstarted work, locally accepted work, possibly submitted effects and observed durable outcomes. Choose borrowed futures, bounded independent work, one owner or a narrow lock from that contract.

## Lifetimes and suspension

Directly awaited futures may borrow inputs. Spawn APIs can require stronger ownership/mobility: Tokio [spawn](https://docs.rs/tokio/latest/tokio/task/fn.spawn.html) requires Send + 'static future and output. Send and 'static differ; async move can move a borrowed reference without extending its referent. Values/guards retained across await affect Send. Local-task APIs have their own bounds; leaking data or changing runtimes is not a borrow fix. Arc supplies shared ownership, not synchronization.

At each relevant await, identify completed changes and the owner retaining partial progress. Interrupted framed reads need the surviving decoder/buffer or a protocol-approved reconnect; restarting a partial write from byte zero may duplicate bytes. Inspect each operation's cancellation contract. Dropping a future does not roll back sent bytes, commits or accepted remote requests.

Keep handles under supervision. Observe success, domain error, panic and cancellation separately. Dropping Tokio [JoinHandle](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html) detaches; abort requests cancellation. Completion is a stronger local observation, still not external rollback. A timeout must not discard the only handle observing continuing work. Reconcile uncertain remote effects using the same operation identity and actual provider lookup/idempotency guarantees; otherwise expose duplicate risk.

## Capacity and state ownership

Bound queued inputs, admitted tasks, in-flight requests, retries and retained output bytes. A bounded channel does not bound spawned senders or their buffers. Acquire capacity before expensive work and retain its token with the actual worker; caller timeout cannot release capacity while blocking work continues. Avoid spawning one waiting task per input.

Define overload: bounded waiting/deadline, rejection, existing durable spill, or coalescing only when intermediate values may be lost. Size/latency assumptions justify capacity. Tokio [mpsc](https://docs.rs/tokio/latest/tokio/sync/mpsc/index.html) closure and draining are separate; permits, sender clones and retry producers affect termination. Successful send means local acceptance, not execution.

Keep policy calculations explicit and deterministic. A short synchronous lock suits a short non-suspending critical section; async locks suit actual asynchronous shared resources. Slow I/O under a guard serializes clients and complicates cancellation. Snapshot revision/policy, compute, then commit through the existing owner/version check. Reacquiring a lock does not validate the old snapshot: re-read/recompute after relevant state or authority changes. Rejected proposals emit no effects. Control callback reentrancy and lock order.

## Blocking work and shutdown

Async syntax does not prevent CPU or synchronous I/O from blocking its polling thread. Use the incumbent bounded blocking boundary. Started Tokio [spawn_blocking](https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html) closures cannot be aborted; shutdown timeout stops waiting without stopping them. Keep output/resource ownership until actual completion or supported cooperative stopping. Do not delete/reuse their paths when the waiter times out.

Shutdown follows dependencies: stop admission/retry producers, notify owners, drain/safely interrupt/persist accepted work, observe tasks, then flush/close dependencies through fallible APIs. Name deadline survivors and restart reconciliation.

## Acceptance probes

- Upload: interrupt after a prefix and after remote acceptance before acknowledgment; preserve session/authoritative offset or reconcile under the actual protocol.
- Index rebuild: cancel the waiter while a blocking writer continues; capacity stays held and partial output remains unpublished.
- Reservation: concurrent proposals from one revision allow only the winning commit's effects; stale/late responses cannot overwrite newer state.
- Pipeline: large messages and slow consumers challenge admission, active work and retained-byte bounds, not just channel length.
- Shutdown: retained sender clones and continuing blocking work expose real deadline and ownership behavior.

Use controllable adapters/barriers instead of arbitrary sleeps. Assert resource ownership and observable effects, not merely returned errors. Compile checks prove selected type bounds; report scheduling, remote outcome and untested shutdown gaps separately.
