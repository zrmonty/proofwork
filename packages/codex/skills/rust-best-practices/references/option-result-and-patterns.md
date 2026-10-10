# Absence, failure and patterns

Read when a change introduces optional values, fallible work, matching or early exits. Start by naming what each outcome means to its caller. Choosing an adapter comes after choosing that contract.

## Decide whether absence is ordinary

`Option<T>` fits a value that can legitimately be absent. `Result<T, E>` fits work that may fail and whose failure matters. Neither provides the domain meaning by itself. Define whether a missing record means an ordinary lookup miss, a denied operation, an expired snapshot or an inconsistent store.

An optional configuration setting can be absent without error and still fail to parse when present. Preserve both facts rather than turning invalid configuration into the default. `Result<Option<T>, E>` can express a successful miss and a failed lookup separately; do not merge them merely to shorten a signature.

Use a dedicated enum when missing, pending and unknown are different decisions. Multiple booleans plus an optional payload invite combinations that callers cannot interpret. Do not add an enum for a private temporary whose two outcomes already have clear meaning.

For collection access, decide whether an invalid index is expected external input or an internal defect. Checked access can expose absence; blindly replacing indexing with a default can conceal corruption. Keep any accepted fallback visible in the contract.

The [Option module](https://doc.rust-lang.org/std/option/index.html) and [Result module](https://doc.rust-lang.org/std/result/index.html) describe the language containers. The application must define the recovery policy.

## Borrow before transforming an owned optional value

Many adapters consume their receiver. If an optional owned string must remain available, transform a borrowed view rather than cloning the whole option to satisfy the compiler. Inspect the actual input and output types at each stage.

`as_ref` exposes an optional shared reference; `as_mut` exposes an optional exclusive reference. `as_deref` is useful when the desired observation is the dereferenced target, such as a string slice, rather than the owning wrapper.

Choose `map` for a value transformation and `and_then` when the next calculation itself returns an option. `flatten` removes one optional layer; use it only when those layers do not represent distinct facts the caller needs.

`transpose` converts an optional fallible calculation into a fallible optional value, preserving absence and error. It is especially useful for optional parsing. Write down the three outcomes before composing: absent, present-valid and present-invalid.

`take` replaces an option with absence and returns its old content. `replace` installs a new value and returns the old one. Both change state; assess interruption and failure ordering before using them on authoritative data or resource owners.

See the [Option methods](https://doc.rust-lang.org/std/option/enum.Option.html), including each method's ownership and stabilization information. Do not select a newer convenience method without checking the repository's minimum supported Rust version.

## Preserve recoverable errors

Use `?` when an error should reach the caller under the enclosing return contract. It does not mean retry, rollback or logging occurred. Conversion into the caller's error type must preserve any distinctions that determine the next action.

Use `map_err` to translate or attach context deliberately. Avoid converting all errors to strings when the caller needs classification. Preserve a cause through the project's existing error implementation, without exposing credentials or private payloads in public output.

`ok` discards a result's error. `filter_map(Result::ok)` discards failures from a stream. Those are policy choices, not harmless cleanup. Allow them only where dropping failures is explicitly accepted and any required rejection accounting survives.

Collecting fallible items into a result supports a fail-fast contract. If partial results must survive, represent accepted values and rejected records explicitly. Neither strategy should accidentally run later external effects after the first failure.

An eager fallback expression is evaluated even when it is not used. A lazy fallback can avoid expensive or effectful work. Do not use either to hide a failed operation under an empty result. Review evaluation order wherever logging, allocation or external work is involved.

The [Result methods](https://doc.rust-lang.org/std/result/enum.Result.html) define transformations. Use [recoverable-error guidance](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html) for propagation, then verify the application's causal and recovery guarantees.

## Make pattern ownership visible

Destructuring can observe or move fields. Before matching a string-bearing enum or struct, decide whether its owner must remain usable afterward. Matching a borrowed view often supplies the observation without duplicating the payload.

Do not assume a binding is owned because its name lacks an ampersand. Match ergonomics can infer a reference binding. Conversely, an explicit reference pattern and `ref` have different roles: one matches a reference shape, the other chooses how a binding borrows.

For nested references or mixed move/borrow patterns, annotate the intermediate type during investigation. Repair the intended ownership relationship rather than adding dereferences until the expression compiles. Moving a non-Copy field can leave only the unmoved fields usable; an owner with Drop has additional move restrictions.

Tuple destructuring is useful for a short, local pair with obvious meaning. Prefer named fields once the positions encode domain roles that readers repeatedly have to remember. Pattern positions are not a substitute for a well-defined API.

The [pattern reference](https://doc.rust-lang.org/reference/patterns.html) is authoritative for binding modes and destructuring. Edition changes affect which explicit binding forms are permitted with inferred borrowing; compile against the project's actual edition.

## Choose the branch form for the decision

Use `match` when every outcome deserves an explicit action, especially domain states or recovery errors. Prefer explicit variants to a catch-all arm when a newly added case should force reconsideration. A wildcard can hide a new state under an old fallback.

Use `if let` when one shape needs handling and ignoring every other shape is intentional. If the ignored cases need distinct recovery, use a complete match. A rejected payment must not disappear merely because the happy path was easier to write.

Use `let else` for a required pattern followed by an early return or other diverging exit. Name the rejected outcome in that exit. Do not use it to erase an important distinction between malformed input and ordinary absence.

Pattern guards add a condition but do not establish that every value is covered. Keep the residual case explicit. Avoid guards with external effects; pure predicates make branch selection replayable and easier to inspect.

Use `matches!` for a boolean classification, not when the caller needs the matched payload. A boolean that immediately causes another match can often become one named decision instead.

Public non-exhaustive types require compatibility-aware fallback handling. Internally closed enums can often benefit from exhaustive matches. Keep those two needs separate instead of imposing a wildcard everywhere.

## Keep panics tied to demonstrated invariants

`unwrap` and `expect` are acceptable only where the project can establish the invariant or the test intentionally fails on its violation. A successful parse in an earlier version is not evidence that untrusted input will remain valid.

An `expect` message should describe the invariant, not include secret input or claim that failure is impossible. Ordinary I/O failure, user input, resource exhaustion and concurrent state changes need recoverable treatment when callers can act on them.

Do not replace an unwrap with an unsafe unchecked operation. Removing a visible panic can introduce undefined behavior and eliminates the very check that made the defect observable.

When a panic is intentionally retained, document the public panic condition where applicable. Confirm that failure cannot leave partially committed effects or rely on destructors being guaranteed under every panic strategy.

## Proof checks

Challenge an optional parser with absent, valid, invalid and boundary input. Assert that invalid data does not select the absence default.

Exercise every recovery class a caller uses. Confirm a failed stream item remains observable under the chosen fail-fast or partial-success policy.

Compile a borrowed match over a non-Copy payload and then use the owner again. Add a small compile-fail check when an intentional move or prohibited borrow is central to the contract; keep it tied to the supported compiler behavior.

Introduce a new domain variant in a temporary fixture and verify that decisions intended to be exhaustive fail to compile until updated. This distinguishes an exhaustive design from a wildcard that silently accepts anything.

Inspect fallback evaluation with a harmless counter where evaluation order matters. Do not use a live external side effect merely to demonstrate eagerness.

Keep pure decision checks separate from adapter checks. An error returned by a pure function does not prove an effect was canceled, a transaction rolled back or a retry is safe.

For state transitions and error taxonomy, continue with [APIs and transitions](api-errors-and-transitions.md). For compatibility across callers, use [downstream compatibility](downstream-compatibility.md).
