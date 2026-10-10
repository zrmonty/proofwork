# Unsafe boundaries, FFI and invariant evidence

Read this when touching unsafe operations, raw ownership, foreign interfaces, manual thread-safety implementations or address-sensitive values. Also read it when a safe API change alters an existing unsafe implementation's assumptions.

## First decide whether the unsafe boundary is needed

Search for the repository's existing safe wrapper and standard-library operation before designing another. Prefer a checked slice, owned buffer, ordinary lock or existing foreign binding when it meets the actual contract. A speculative allocation saving does not justify a new soundness obligation.

Map the changed operation through constructors, methods, adapters, callbacks and destruction. Include safe clients outside the current crate. A safe wrapper must remain sound for every use permitted by its public contract, including repeated calls, empty input, early return, reentrancy and legal moves or drops. Tests of the intended caller alone cannot establish that property. See the [Rust Reference's soundness obligation](https://doc.rust-lang.org/reference/behavior-considered-undefined.html).

Keep policy decisions pure: validate lengths, choose transitions and classify foreign statuses without touching foreign memory. The narrow effect boundary owns pointer access, registration and release. Pure planning does not make those effects atomic or trustworthy.

## Write an evidence-bearing obligation ledger

For each unsafe operation or implementation, record the requirement, the mechanism enforcing it and the changes that could invalidate it. Keep the explanation adjacent to the boundary; a small table in a review is useful when several operations share an invariant.

| Obligation | Evidence to find | Change that requires another review |
| --- | --- | --- |
| Allocation and address | Actual allocation owner, permitted offsets, alignment and extent | Buffer replacement, resizing, packed layout or integer conversion |
| Initialized and valid values | Successful initialization and checked representation | Error-path changes, new variants or output-length handling |
| Aliasing and lifetime | Exclusive access or bounded shared access tied to the owner | New accessor, callback, clone, await or retained pointer |
| Ownership and destruction | Exactly one release policy with the matching allocator | Transfer, cancellation, partial initialization or new Drop behavior |
| Thread and unwind behavior | Documented foreign contract and enforced synchronization | Task migration, reentrancy, panic policy or manual Send/Sync |

A safety comment should name the constructor, check, borrowing restriction or foreign guarantee that does the work. If a necessary guarantee cannot be found, retain an unresolved obligation; do not replace it with “the library probably does this.”

An unsafe function's documented caller obligations and an unsafe block's local obligations are different. Audit both, including callers introduced indirectly by a safe method. Do not make an API unsafe merely to evade a validation step that the wrapper can reliably perform.

## Establish memory validity before creating typed access

For a raw slice conversion, establish a live single allocation, appropriate alignment, valid initialized elements, permitted total size and a lifetime bounded by the owning resource. Adjacent allocations cannot be combined into one slice. Empty input still needs the particular API's pointer preconditions; handle a foreign null-plus-zero convention before conversion. A non-null address does not establish any of the other obligations. See [from_raw_parts safety requirements](https://doc.rust-lang.org/std/slice/fn.from_raw_parts.html).

Do not borrow a temporary foreign buffer for longer than the foreign API permits. A buffer valid until the next library call cannot become an unrestricted Rust slice retained across that call. Copy into an owned value when that is the smallest sound contract; introduce guarded borrowing only when its owner actually prevents invalidating operations.

Use the project's established pointer mechanisms and verify provenance requirements for the exact operation. Integer-address arithmetic or a pointer cast is not evidence that dereferencing the result is permitted. Do not claim Rust's complete aliasing or provenance model is settled; the [Reference documents remaining limitations](https://doc.rust-lang.org/reference/behavior-considered-undefined.html).

`UnsafeCell` allows specific interior mutation; it does not authorize aliased mutable references or eliminate data races. Review every accessor and callback that can reach the cell, not just the method that writes it. Prefer an existing synchronization primitive over a new unsafe protocol. See [UnsafeCell's aliasing and concurrency contract](https://doc.rust-lang.org/std/cell/struct.UnsafeCell.html).

## Separate storage, initialization and ownership

Capacity reserves storage; it does not initialize elements. Before extending a vector's length, establish that every newly exposed element contains a valid value of its type. Foreign success codes and written-length outputs need separate checks against the actual allocation and documented initialization guarantee.

Track which fields or prefix elements became initialized when construction can fail or unwind. Clean up initialized owned values according to the chosen failure policy without reading or dropping the uninitialized remainder. Do not promote partially initialized storage to a complete Rust value.

`MaybeUninit` exposes the initialization obligation rather than solving it. Zero bytes are not valid initialization for arbitrary references, enums or owned containers. Repeated extraction can also duplicate ownership. Prefer safe initialized storage if it removes these obligations without a measured cost that matters. See [MaybeUninit's initialization contract](https://doc.rust-lang.org/std/mem/union.MaybeUninit.html).

Do not make memory safety depend on Drop executing: safe clients can leak or forget values. When destruction does run, preserve allocator pairing and release ordering. Business durability, callback quiescence and successful flush remain additional contracts.

## Treat the foreign interface as a real consumer

Check the actual header or authoritative foreign API contract, library version, supported target ABI and compiler settings. Match parameter widths, signedness, calling convention and symbol linkage. A Rust declaration that compiles does not demonstrate that the foreign function has that signature.

Layout annotations apply to the annotated representation; they do not make nested Rust containers or trait objects valid foreign values. Check each field's representation. Packed fields require particular care before forming references. Avoid transmuting wire bytes into enums or structured values; decode and validate them instead.

For each pointer, specify borrowed versus transferred ownership, mutability, length units, null behavior and duration. Pair foreign allocation with the foreign release routine. Never reconstruct a Rust Box, String or Vec from foreign storage without satisfying that type's exact ownership and allocation contract.

For retained callbacks, the registration owner must keep context and referenced resources alive. Determine whether unregistration waits for active callbacks, whether callbacks can race or reenter, and which thread invokes them. A destructor that merely requests unregistration cannot free context while a callback still uses it. See the [Rustonomicon's FFI guidance](https://doc.rust-lang.org/nomicon/ffi.html).

Make the panic and exception policy explicit for each direction and ABI. Prevent Rust unwinding across a boundary that forbids it, or use an explicitly supported unwinding contract. Catching Rust panics is not a universal handler for foreign exceptions and does not operate as recovery under panic-abort. Keep callbacks' ordinary validation failures in their return/status contract.

## Thread safety and atomics need a complete protocol

Before a manual Send or Sync implementation, inspect the entire reachable value: foreign handle restrictions, interior mutability, destructor thread requirements, callbacks and all safe accessors. Ownership transfer and concurrent shared access are distinct promises. Pointer storage or an Arc wrapper supplies neither proof. See [Send and Sync obligations](https://doc.rust-lang.org/nomicon/send-and-sync.html).

For an existing atomic protocol, state the published data, ordering relation, permitted readers and reclamation owner. An atomic flag does not make unrelated ordinary writes safe. Stronger ordering alone does not repair use-after-free, ABA or incorrect lifetime management. Prefer the incumbent lock/channel when it makes the invariant enforceable. Check [Rust's atomic memory model and target limits](https://doc.rust-lang.org/std/sync/atomic/index.html).

## Pinning is an address and destruction promise

Use pinning only when a value's contract depends on remaining at its address. Identify which fields are structurally pinned, which operations can expose or replace them, how projection preserves that policy and when storage may be reused. Pinning does not keep a foreign callback context alive by itself.

An unsafe projection or custom destructor must preserve the pinned invariant through every safe method, including replacement and early destruction. Do not assume moving a pointer owner moves its pointee, or assume Pin prevents every move regardless of Unpin. Use the repository's existing safe projection mechanism where available. See [Pin's safety and Drop requirements](https://doc.rust-lang.org/std/pin/index.html).

## Worked failures and bounded repairs

| Failure | Smallest adequate repair | Evidence that challenges it |
| --- | --- | --- |
| Foreign writer initializes four elements, but wrapper exposes the whole capacity | Expose only the validated initialized count and preserve error-path cleanup | Empty, partial, exact-capacity and inconsistent-count outcomes; review the writer's bounds guarantee |
| Safe reader returns a slice into a buffer invalidated by the next call | Return owned data or bind access to an owner that prevents invalidation | Retain the first result while making another call; exercise moves and destruction |
| Unregister returns while an in-flight callback retains a context pointer | Use the API's completion mechanism before release, or a supported lifetime protocol | Callback/unregister overlap and shutdown with pending work; actual foreign lifecycle evidence |
| Atomic “ready” flag publishes storage that can be reclaimed concurrently | Repair ownership/reclamation and publication together, or use an existing lock | Readers racing publication and teardown; explain ordering and lifetime independently |
| A panic during element construction leaves an inflated vector length | Keep initialized length truthful through every exit and unwind path | Inject failure at each relevant construction stage; verify each initialized resource is released once |

Do not test an invalid foreign writer by permitting it to overrun real memory. Use a bounded model or controlled test double to challenge wrapper decisions, then distinguish that result from the actual library's memory-writing guarantee.

## Verification finds violations; it does not certify soundness

Run ordinary tests first for the safe contract, including failure and cleanup paths. When suitable tooling is already available, use [Miri](https://github.com/rust-lang/miri) for supported Rust paths and [sanitizers](https://doc.rust-lang.org/unstable-book/compiler-flags/sanitizer.html) for relevant native executions. Identify which unsafe sites and foreign paths were actually exercised.

Miri has interpreter, platform and foreign-call limitations; a native library path may be unavailable or modeled. Sanitizer support depends on compiler, target and instrumentation, including relevant foreign code. Do not silently install toolchains, change global defaults or substitute a different supported target to manufacture coverage. Record missing tools and unexercised boundaries.

Report the compiler, target, feature set, foreign library identity, tested paths and remaining obligations. Passing tools establish observations over those runs; they do not prove all safe callers, interleavings or representations are sound. A newly supported method or layout change reopens its affected obligations even when the unsafe block's text remains unchanged.
