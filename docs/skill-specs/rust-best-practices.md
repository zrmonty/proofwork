# rust-best-practices specification

Status: authored original Proofwork guidance, 2026-10-10. Package and host behavioral evidence tracked separately.

## Purpose and trigger
Use for general Rust implementation or review; model ownership, errors, numeric limits, and explicit effects with the project's toolchain.

## Inputs and boundaries
The skill requires the assignment objective, relevant project conventions, caller/content contracts, and available verification capabilities. It preserves authorized scope and host permissions. It introduces no mandatory dependency or global configuration change. Its SKILL.md defines the specific inputs and technical limits.

## Required workflow
Inspect toolchain and callers, decide ownership/borrowing, retain recoverable errors, check numeric policy, examine shared state/cancellation and unsafe invariants where relevant, and run configured cargo checks.

## Output and evidence contract
Report actual result, affected contracts, checks performed, artifacts tied to current revision/digests, unresolved criteria, and justified material deviations. Compilation or style alone cannot establish runtime behavior. Missing execution remains explicitly unverified.

## Acceptance cases
Use evals/language-scenarios.md. Applicable cases: Rust-summary, State-effects, Mixed-contract.
Material behavior or honesty failures fail a case. Review must also accept the intentionally clean case. Fresh-context paired runs distinguish current capability from incremental skill benefit.

## Authorship and evaluation
Requirements originate in the approved Proofwork design and user preferences. The instructional text and workflow were written for these requirements; no upstream skill assets were imported or adapted. Official documentation linked in the skill supplies technical grounding only. Coordinator supplied a fresh Codex pre-skill baseline at evals/results/baseline.txt: pure input handling, Python mutable-default avoidance, Rust recoverable input errors, and generic frontend critique already worked. It did not establish Proofwork-specific routing, rendered design iteration, integration, or host parity. Detailed scenario prompts/rubrics were recorded before authoring; that broad baseline does not count as running every listed case. Guided evaluation and full language/browser fixtures remain pending until artifacts demonstrate them.
