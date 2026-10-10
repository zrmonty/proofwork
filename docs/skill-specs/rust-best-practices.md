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

## Executed example evidence

On 2026-10-10, both Rust Markdown blocks were extracted into an isolated temporary source and compiled with rustc 1.95.0 using --test. The ledger_contract test passed: ordinary and empty totals, preserved borrowed input, negative entry and overflow rejection. This establishes example behavior on that compiler, not minimum-compiler compatibility, all Cargo feature/target combinations, unsafe soundness, cancellation behavior, or incremental skill benefit. Repository toolchain configuration was unchanged.

## Authorship and evaluation
Requirements originate in the approved Proofwork design and user preferences. The instructional text and workflow were written for these requirements; no upstream skill assets were imported or adapted. Official documentation linked in the skill supplies technical grounding only. Coordinator supplied a fresh Codex pre-skill baseline at evals/results/baseline.txt: pure input handling, Python mutable-default avoidance, Rust recoverable input errors, and generic frontend critique already worked. It did not establish Proofwork-specific routing, rendered design iteration, integration, or host parity. Detailed scenario prompts/rubrics were recorded before authoring; that broad baseline does not count as running every listed case. Guided evaluation and full language/browser fixtures remain pending until artifacts demonstrate them.
