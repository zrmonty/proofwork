# typescript-best-practices specification

Status: authored original Proofwork guidance, 2026-10-10. Package and host behavioral evidence tracked separately.

## Purpose and trigger
Use for TypeScript and TSX changes or reviews; preserve runtime contracts with truthful types and pure domain logic.

## Inputs and boundaries
The skill requires the assignment objective, relevant project conventions, caller/content contracts, and available verification capabilities. It preserves authorized scope and host permissions. It introduces no mandatory dependency or global configuration change. Its SKILL.md defines the specific inputs and technical limits.

## Required workflow
Inspect compiler/runtime/module contracts and callers. Load domain-contract or effect references only when applicable. Validate unknown input with shape and domain rules; model legal state combinations and exhaustiveness; justify assertions; preserve promised input ownership; define async completion/cancellation/partial-effect policy; check affected consumers using configured tools. Prefer pure domain decisions while accepting clear private mutation. Do not migrate configuration or add frameworks incidentally.

## Output and evidence contract
Report actual result, affected contracts, checks performed, artifacts tied to current revision/digests, unresolved criteria, and justified material deviations. Compilation or style alone cannot establish runtime behavior. Missing execution remains explicitly unverified.

## Acceptance cases
Use evals/language-scenarios.md. Applicable cases: TS-boundary, State-effects, Mixed-contract.
Material behavior or honesty failures fail a case. Review must also accept the intentionally clean case. Fresh-context paired runs distinguish current capability from incremental skill benefit.

Additional measurable cases for the deeper guidance:

| Request/fixture | Required observable result | Failure condition |
| --- | --- | --- |
| Retry JSON accepts integers from 0 through 8 | Zero and eight succeed; null, missing value, nine, negative/fractional values and invalid JSON reject | Cast establishes trust; valid zero rejects; any invalid case succeeds |
| Add cancelled to the export-state union | Compiler identifies the previously exhaustive handler; implementation makes an explicit new decision | Assertion/default success hides missing handling |
| Sort caller-owned pages | Sorted output and unchanged input order; shallow object sharing is described accurately | Input sorted in place or deep immutability falsely claimed |
| Earlier search resolves after newer search | Only latest eligible request commits; failure and teardown have owners | Stale result commits or cancellation is asserted to undo remote writes |
| Existing well-typed local accumulator | Accept it if it preserves the contract and caller data | Rewrite solely to eliminate loops or local mutation |

## Additional decision cases from the second depth review

- A server emits integer ID 9007199254740993: preserve its exact protocol representation; stringifying an already parsed rounded number fails.
- A record's version changes while an operation awaits: snapshot stable fields or revalidate before commit; earlier narrowing alone cannot establish current validity.
- A large batch requires at most four in-flight operations: bound operation starts and own every failure; awaiting a fully started collection fails the limit.
- A sparse lookup misses a key: handle absence rather than treating `Record<string, Value>` as runtime membership proof.

These are authored acceptance cases, not claims of executed integration evidence.

## Executed example evidence

On 2026-10-10, Markdown code blocks were extracted and combined in an isolated temporary directory. TypeScript 5.9.3 compiled the examples using strict checking, no emit, target ES2022 and ESNext modules. Node 24.16.0 ran added decoder/label/order assertions successfully. A negative fixture adding cancelled failed compilation at the never argument as expected (TS2345). These checks verify the examples, not framework integration, older compiler compatibility, async behavior, or incremental skill benefit. The compiler ran through an ephemeral npm invocation; repository dependencies and user configuration were not changed.

## Conditional reference expansion

Reference map: references/patch-and-presence.md is loaded only for partial updates, omitted/null/undefined semantics, writable-field restrictions, nested replacement policy and stale drafts.

Required acceptance: A nickname patch preserves an omitted value, clears only under the endpoint's null policy, and serializes valid empty values accurately. A stale draft retains user intent under the documented conflict policy; whole-record overwrites and browser-only authorization fail.

The reference is original decision guidance. These cases specify observable acceptance; they are not claims of executed application, framework, provider or benchmark evidence. Existing strict typing, functional ownership, coverage and project-specific policies remain in force.

## Authorship and evaluation
Requirements originate in the approved Proofwork design and user preferences. The instructional text and workflow were written for these requirements; no upstream skill assets were imported or adapted. Official documentation linked in the skill supplies technical grounding only. Coordinator supplied a fresh Codex pre-skill baseline at evals/results/baseline.txt: pure input handling, Python mutable-default avoidance, Rust recoverable input errors, and generic frontend critique already worked. It did not establish Proofwork-specific routing, rendered design iteration, integration, or host parity. Detailed scenario prompts/rubrics were recorded before authoring; that broad baseline does not count as running every listed case. Guided evaluation and full language/browser fixtures remain pending until artifacts demonstrate them.
