# Vectors, arrays and slices

Read when changing sequence storage, indexing, resizing, iteration or mutable regions. Begin with order, duplicate, length, failure and ownership requirements; do not choose a representation from familiarity alone.

## Select the smallest adequate shape

| Shape | Use when | Cost or constraint to inspect |
| --- | --- | --- |
| `[T; N]` | Length belongs to the type or a fixed contract | Changing N changes the type; large values and moves need measurement |
| `Vec<T>` | Owned length varies at runtime | Allocation, capacity and growth policy |
| `&[T]` | A consumer only observes a contiguous sequence | Owner must survive the borrowed result |
| `&mut [T]` | A consumer changes elements without resizing | Exclusive access; length remains fixed |
| Existing queue structure | Work needs frequent front removal | Ordering and memory behavior differ from a vector |

Prefer slices for helpers that do not need vector-specific resizing or capacity. Keep Vec when ownership transfer or retained growable storage is part of the operation. Do not introduce a generic abstraction solely to accept two shapes already supported by a slice.

Arrays are homogeneous; tuples can express a small heterogeneous grouping. If fields have domain meaning or positional mistakes recur, use a named struct rather than a longer tuple.

Check array trait support and by-value iteration against the actual edition and minimum compiler. See the [array contract](https://doc.rust-lang.org/std/primitive.array.html) and [array iteration compatibility](https://doc.rust-lang.org/edition-guide/rust-2021/IntoIterator-for-arrays.html).

## Length, capacity and initialized elements are different facts

A vector's length identifies its elements; spare capacity is not additional initialized data. Reservation does not resize the sequence. Never expose spare storage as ordinary values or adjust length to pretend initialization happened.

Validate untrusted counts and checked size arithmetic before requesting space. Select recoverable reservation where the application has a real response to failure, without claiming that one fallible reservation makes every later allocation recoverable.

Do not rely on a particular capacity growth factor. Do not shrink after every operation merely to lower one observed capacity number. Choose retained-buffer limits from expected concurrency, input sizes and memory budget.

A reference into vector elements cannot remain in conflicting safe use across structural mutation. Raw pointers have separate invalidation obligations; extra reserved capacity is not a general permission to ignore aliasing, element movement or destruction.

The [Vec contract](https://doc.rust-lang.org/std/vec/struct.Vec.html) grounds these representation facts. Capacity observations alone do not establish peak allocated bytes or end-to-end throughput.

## Indexing must match the failure contract

Use checked access for positions or ranges derived from untrusted input or changing runtime state. A valid index at the time it was recorded may refer to a different element after deletion or sorting; bounds and identity are separate checks.

Validate a half-open interval as ordered endpoints within the current length. Inclusive endpoints need their own overflow and empty-range policy. Avoid converting an external signed position with an unchecked cast that turns a negative value into a huge index.

An indexing panic can be justified by a local invariant established immediately before use. Do not assume a comment asserting that invariant protects a public caller. Error messages should report position/context without disclosing sensitive element content.

The [slice access documentation](https://doc.rust-lang.org/std/primitive.slice.html#method.get) distinguishes optional access from panicking indexing. The domain decides whether an invalid range rejects the operation, clips it or represents an empty result.

## Choose mutation by observable meaning

| Operation intent | Questions before selection |
| --- | --- |
| Remove one element | Must relative order survive? Is the removed value needed? |
| Keep selected elements | Is predicate evaluation pure? What happens if it fails? |
| Remove a range | Must removed values be processed? What if processing stops early? |
| Append another sequence | Is ownership transfer intended? Must the source remain usable? |
| Sort or deduplicate | Does reordering or duplicate removal change business meaning? |
| Replace several elements | Must validation complete before any visible change? |

Use `remove` when its order behavior matches the contract; use `swap_remove` only when the moved last element and changed order are acceptable. A shorter implementation that changes ordering is a behavior change.

Draining is destructive: dropping a partially consumed drain does not restore the selected range. Do not use it to “preview” records before a fallible export. Decide whether to validate first, retain ownership elsewhere or accept explicit partial progress.

A retain predicate that causes external effects mixes selection with execution. Calculate intended selections or effects separately when rollback/retry semantics matter. A privately mutated builder can still return a pure next value.

Consult [drain](https://doc.rust-lang.org/std/vec/struct.Vec.html#method.drain) before relying on cleanup behavior; leaking its iterator forfeits normal destructor assumptions. Do not leak it as an ownership workaround.

## Express disjoint mutable regions safely

Use a supported safe splitting API for simultaneous access to separate regions. Validate the split point and decide whether empty sides are allowed. Do not ask a whole-vector helper for exclusive access when it only needs one region.

For two arbitrary positions, define equal-index behavior before splitting. The ordered positions need validation against the current length; a previously checked length can become stale after resizing.

The [slice splitting contract](https://doc.rust-lang.org/std/primitive.slice.html#method.split_at_mut) expresses disjoint regions. Availability of checked or multi-access variants depends on the minimum supported compiler; inspect stabilization rather than assuming today's documentation matches the project.

Never infer that two raw addresses are safe merely because their integer values differ. Safe collection access is preferable to introducing alignment, provenance and aliasing obligations for an ordinary update.

## Arrays and conversion boundaries

Use an array when exact length is part of validation, not as a replacement for every small vector. A runtime input converted to a fixed-length representation needs an explicit wrong-length outcome.

Borrowing a vector as a slice avoids allocation; producing an owned vector from a borrowed sequence requires ownership of the elements, usually through permitted duplication. Converting storage does not remove element invariants or change how errors must be reported.

For fixed-size binary messages, keep transport decoding separate from domain interpretation. Array length alone does not validate an encoding, endianness, checksum or authorization.

## Acceptance probes

- Empty, single, exact-bound and out-of-range inputs, plus inverted ranges.
- Deletion from first, middle and last positions with the required ordering asserted.
- Duplicate-heavy input where deduplication must preserve the documented meaning.
- Early exit during destructive iteration and failure before intended state publication.
- A slice caller over an array and over a vector, including retained borrowed results.
- A large validated input and a rejected excessive count without requesting excessive allocation.
- Debug and optimized behavior for relevant numeric/index policies; exact toolchain and target recorded.

Keep tests about the sequence contract rather than whether the implementation uses a loop or adapter. A borrowed helper compiling does not prove a parser's retained data is semantically fresh or a buffer remains within the deployment memory budget.
