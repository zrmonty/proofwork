# rust-best-practices specification

Status: authored original Proofwork guidance, 2026-10-10. Package and host behavioral evidence tracked separately.

## Purpose and trigger
Use for general Rust implementation or review; model ownership, errors, numeric limits, and explicit effects with the project's toolchain.

## Inputs and boundaries
The skill requires the assignment objective, relevant project conventions, caller/content contracts, and available verification capabilities. It preserves authorized scope and host permissions. It introduces no mandatory dependency or global configuration change. Its SKILL.md defines the specific inputs and technical limits.

## Required workflow
Inspect the toolchain, minimum compiler policy, feature/target combinations and callers. Load ownership/domain or resources references only when applicable. Choose ownership from actual consumption and lifetime needs, retain actionable errors, enforce numeric policy, preserve deterministic decisions, inspect lock scope/revalidation and cancellation/partial effects, audit unsafe obligations, and run configured checks. Accept clear local mutation and concrete APIs; do not add speculative abstraction or crates.

## Output and evidence contract
Report actual result, affected contracts, checks performed, artifacts tied to current revision/digests, unresolved criteria, and justified material deviations. Compilation or style alone cannot establish runtime behavior. Missing execution remains explicitly unverified.

## Acceptance cases
Use evals/language-scenarios.md. Applicable cases: Rust-summary, State-effects, Mixed-contract.
Material behavior or honesty failures fail a case. Review must also accept the intentionally clean case. Fresh-context paired runs distinguish current capability from incremental skill benefit.

Additional measurable cases for the deeper guidance:

| Request/fixture | Required observable result | Failure condition |
| --- | --- | --- |
| Summarize a nonnegative borrowed ledger | Empty total is zero, ordinary total is correct, caller retains unchanged entries | Consumed input or hidden clone to disguise ownership |
| Negative entry and MAX plus one | Typed recoverable errors identify the failing index in both cases | Panic, wrapping, or success value on invalid input |
| Snapshot shared state before I/O | Any subsequent commit rechecks the condition/version; lock scope and failure ownership are stated | Snapshot decision overwrites newer state or lock accidentally spans suspension |
| Public API with optional supported adapters | Actual relevant consumers/features compile or the gap is explicit | Default-feature test labeled full coverage |
| Unsafe wrapper changes ownership | Safety preconditions and enforcement are reviewed across callers | Passing tests cited as sufficient proof of soundness |
| Clean local loop with private accumulator | Accept when invariants and ownership remain clear | Rewrite solely to remove mut or demand extra allocations |

## Additional decision cases from the second depth review

- Truncate text containing a multibyte character: settle byte versus display semantics and avoid an invalid slice boundary; a successful ASCII-only test is insufficient.
- A fallible input stream contains one rejected record: preserve fail-fast or observable partial-result policy; silently using `filter_map(Result::ok)` fails unless dropping errors is the actual contract.
- Two tasks clone an Arc: recognize shared inner ownership and require the inner type's real synchronization contract; claiming independent copies fails.
- A caller times out while blocking work continues: retain an owner until completion and do not reuse its resource prematurely; ending the await is insufficient evidence of shutdown.

These are authored acceptance cases, not claims of executed integration evidence.

## Executed example evidence

On 2026-10-10, both Rust Markdown blocks were extracted into an isolated temporary source and compiled with rustc 1.95.0 using --test. The ledger_contract test passed: ordinary and empty totals, preserved borrowed input, negative entry and overflow rejection. This establishes example behavior on that compiler, not minimum-compiler compatibility, all Cargo feature/target combinations, unsafe soundness, cancellation behavior, or incremental skill benefit. Repository toolchain configuration was unchanged.

## Conditional reference expansion

Reference map: references/downstream-compatibility.md is loaded only for actual downstream APIs, relevant feature combinations, isolated minimal builds and validated construction through optional adapters.

Required acceptance: A workspace parser succeeds only because another package enables a feature: check its supported isolated consumer and fix the declared contract. New public enum/ownership behavior checks affected callers; a newer default build cannot certify minimum-compiler or adapter support.

The reference is original decision guidance. These cases specify observable acceptance; they are not claims of executed application, framework, provider or benchmark evidence. Existing strict typing, functional ownership, coverage and project-specific policies remain in force.

## Deep Rust decision references

Load references/api-errors-and-transitions.md for public signatures, domain errors, validated construction and pure versioned proposals. Load references/async-cancellation-and-backpressure.md for supervised task lifetime, partial I/O, admission/result bounds and shutdown. Load references/performance-and-representation.md for measured ownership/collection/layout costs. Load references/unsafe-ffi-and-invariants.md for safe-wrapper obligations, native ownership, callbacks, pinning and manual thread-safety contracts. Existing ownership/resource/downstream references remain the starting point; these guides are conditional, not a mandatory new runtime architecture.

Required decisions: preserve recovery categories and source causes; keep arithmetic independent of build mode; express changed state decisions as pure next-value/effect proposals; enforce current authority and conditional commit at the real boundary. Independent owned work is preferred where it removes sharing. Bounds apply to queued, in-flight, blocking and retained output work, not only currently running futures. Unsafe invariants cover all callers of a safe wrapper, including error, cancellation and destruction; tests alone cannot prove soundness.

Additional acceptance cases:

- Two valid reservations calculated from one snapshot: only the accepted version can issue effects; preserve insufficient-stock and overflow errors, unchanged input and deterministic output.
- Cancelled framed I/O or a waiter over ongoing blocking work: account for partial progress, permit/resource ownership and unknown effects; dropping an await cannot prove rollback.
- A burst of tasks has bounded execution but unbounded queued buffers/results: identify and bound the actual retained work rather than declaring the system bounded.
- Borrowed parse fields retain a large source buffer or a faster collection loses order/duplicate policy: measure retained cost and preserve semantics before selecting a representation.
- A safe FFI wrapper accepts a null/invalid range or outlives a callback owner: restore enforceable validity/lifetime bounds; document allocator, unwind and thread contracts.
- Atomic publication lacks an object-lifetime/reclamation argument: do not claim an ordering change establishes safety. Prefer a supported safe mechanism where it meets the need.
- Default tests pass but affected consumer/features, branch metrics or unsafe tooling are unavailable: keep the exact unsupported claim unverified and preserve source/gate definitions.

These acceptance cases are authored guidance. The verification report separately identifies any executed snippet, feature/target matrix, tool result or application integration.

## Authorship and evaluation
Requirements originate in the approved Proofwork design and user preferences. The instructional text and workflow were written for these requirements; no upstream skill assets were imported or adapted. Official documentation linked in the skill supplies technical grounding only. Coordinator supplied a fresh Codex pre-skill baseline at evals/results/baseline.txt: pure input handling, Python mutable-default avoidance, Rust recoverable input errors, and generic frontend critique already worked. It did not establish Proofwork-specific routing, rendered design iteration, integration, or host parity. Detailed scenario prompts/rubrics were recorded before authoring; that broad baseline does not count as running every listed case. Guided evaluation and full language/browser fixtures remain pending until artifacts demonstrate them.

## Curriculum-depth expansion

The topic guide routes one Rust entry to twenty-three focused, originally authored references. The [coverage map](../rust-topic-coverage.md) covers all 75 readable numbered topics across nine supplied images, with duplicate 27 counted once and unseen 9/60/61 explicitly uninferred. Review panels map to contract checks. Do not import educational wording or external skill assets.

Acceptance requires exact ownership/item shapes, binding versus referent mutability, non-Copy observation, reborrowing and disjoint-access policy, Vec/array/slice semantics, HashMap/HashSet identity and duplicate laws, checked conversions, UTF-8 units, Option/Result recovery and matching, validated structs/enums, trait capability/dispatch, derives, and numeric/float policy. Existing demanding API/async/unsafe guidance remains conditional.

Existing ledger and reservation examples are aligned through cohesive calculation helpers, not compressed statements. Worked examples cover reference layers and tuples, preserved input, owned private mutation, fail-fast narrowing, Entry duplicates, checked UTF-8 boundaries, nonfinite admission and disjoint reborrowing. Checks must use exact current blocks, not historic fixture output.

Independent scenario reasoning is useful for finding guidance defects but does not establish application correctness, agent improvement or host certification. Actual compilation, debug/release tests, formatting, Clippy and expected compiler-error checks are reported separately; unsupported coverage, minimum toolchain, targets and unsafe tools remain unverified.

## Atomics expansion

The conditional atomics-and-memory-ordering reference distinguishes atomic access, compound-update indivisibility, publication ordering and storage lifetime. It covers CAS retry purity, valid success/failure orderings, RMW halves, overflow, fences, ABA/reclamation, target support and progress guarantees. Its motivating actual counter probe is recorded in evals/results/atomics-probe-20261010.md; that regression is not weak-memory or agent-benefit evidence.
