# Unsafe and foreign-boundary obligations

Prefer existing safe wrappers, slices, owned buffers or locks. Map constructors, methods, adapters, callbacks and destruction, including safe clients outside the crate. A safe wrapper must be sound for every permitted use, not just the intended caller. Keep policy calculations separate from pointer access, registration and release.

## Record the enforcing mechanism

For each unsafe site, name its obligation and actual enforcement: allocation/alignment/extent; initialized valid representation; aliasing/lifetime; matching ownership/destruction; thread/unwind policy. Identify changes reopening those proofs. Unsafe-function caller requirements differ from an unsafe block's local justification. Missing foreign guarantees remain unresolved, not assumed. See the [Reference](https://doc.rust-lang.org/reference/behavior-considered-undefined.html).

Before [from_raw_parts](https://doc.rust-lang.org/std/slice/fn.from_raw_parts.html), establish one live allocation, alignment, initialized valid elements, permitted total size and owner-bounded lifetime. Adjacent allocations cannot form one slice. Empty slices still require the API's pointer preconditions; translate foreign null-plus-zero conventions first. Non-null is insufficient. A temporary foreign buffer cannot remain borrowed across an invalidating call: copy or enforce guarded ownership.

Casts/integer arithmetic do not prove pointer provenance. Rust's complete aliasing/provenance model retains documented limitations. [UnsafeCell](https://doc.rust-lang.org/std/cell/struct.UnsafeCell.html) does not permit aliased mutable references or data races; audit every accessor/callback.

## Initialization and destruction

Capacity is not initialized length. Check foreign status and written count against allocation and documented bounds before exposing elements. Track initialized prefixes/fields on every error/unwind path; release only initialized owned values. [MaybeUninit](https://doc.rust-lang.org/std/mem/union.MaybeUninit.html) exposes rather than removes this obligation. Zero bytes are not valid for arbitrary types; repeated extraction can duplicate ownership.

Memory safety cannot depend on Drop running: safe clients may leak values. When destruction runs, preserve allocator pairing and order. Successful flush, durability and callback quiescence need separate guarantees.

## Foreign consumers and pinned values

Verify headers, library version, target ABI, widths, signedness, symbols and calling convention. Compilation does not establish a foreign signature. Layout annotations do not make nested Rust containers/trait objects foreign-compatible. Avoid packed-field references and transmuting wire bytes into unchecked enums; decode instead.

Every foreign pointer needs ownership-transfer, mutability, units, null and duration policy. Use the foreign release routine; do not reconstruct Box/String/Vec without their exact allocation/ownership requirements. Retained callbacks need live context/resources, known threads/reentrancy and an unregistration mechanism that actually waits for active callbacks before freeing context. See [FFI](https://doc.rust-lang.org/nomicon/ffi.html).

Specify each direction's panic/exception ABI. Catching Rust panics cannot universally recover foreign exceptions and does not recover under panic-abort. Manual [Send/Sync](https://doc.rust-lang.org/nomicon/send-and-sync.html) requires the entire reachable value's access, callback and destructor thread contracts; pointers and Arc supply no proof. Atomic publication/reclamation follows [the atomic protocol](atomics-and-memory-ordering.md).

[Pin](https://doc.rust-lang.org/std/pin/index.html) concerns address-sensitive invariants, structural projection and destruction/storage reuse. It does not itself keep callback context alive; Unpin and safe replacement access matter. Prefer existing safe projection mechanisms.

## Challenge failures without causing invalid writes

Check partial initialization, inconsistent counts, retained results across invalidating calls, callback/unregister overlap, publication/teardown and construction panics. Expose only verified initialized counts; release context only after actual quiescence. Use bounded doubles/models for foreign overrun scenarios, never permit an invalid writer to corrupt real memory.

Ordinary safe-contract tests come first. [Miri](https://github.com/rust-lang/miri) and [sanitizers](https://doc.rust-lang.org/unstable-book/compiler-flags/sanitizer.html) have platform, foreign-call and instrumentation limits. Record compiler, target, features, foreign identity, exercised sites and unresolved obligations. Do not install toolchains/change global defaults to manufacture a pass. Tools find violations in observed runs; they do not certify all callers or soundness. Safe API/layout changes can invalidate unchanged unsafe blocks.
