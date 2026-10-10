# python-best-practices specification

Status: authored original Proofwork guidance, 2026-10-10. Package and host behavioral evidence tracked separately.

## Purpose and trigger
Use for Python implementation or review; make dependencies, mutation, resource lifetime, and error contracts explicit.

## Inputs and boundaries
The skill requires the assignment objective, relevant project conventions, caller/content contracts, and available verification capabilities. It preserves authorized scope and host permissions. It introduces no mandatory dependency or global configuration change. Its SKILL.md defines the specific inputs and technical limits.

## Required workflow
Inspect supported interpreters, callers, import/dependency conventions and existing checks. Load data/boundary or effects references only when relevant. Use accurate collection/iterator interfaces, decode external shape and domain rules, preserve promised alias ownership, separate deterministic decisions from effects, preserve actionable exceptions and causes, bound resource/generator lifetimes, and review cancellation/subprocess partial outcomes. Accept useful Python idioms and local mutation without imposing frameworks.

## Output and evidence contract
Report actual result, affected contracts, checks performed, artifacts tied to current revision/digests, unresolved criteria, and justified material deviations. Compilation or style alone cannot establish runtime behavior. Missing execution remains explicitly unverified.

## Acceptance cases
Use evals/language-scenarios.md. Applicable cases: Python-alias, State-effects, Mixed-contract.
Material behavior or honesty failures fail a case. Review must also accept the intentionally clean case. Fresh-context paired runs distinguish current capability from incremental skill benefit.

Additional measurable cases for the deeper guidance:

| Request/fixture | Required observable result | Failure condition |
| --- | --- | --- |
| Decode order quantity from 1 through 100 | Valid endpoints succeed; bool, float, missing, zero and 101 reject | Annotation used as validator or True accepted as quantity |
| Append to a nested caller-owned batch | Original batches unchanged; returned list edits do not alter original batch lists | Shallow outer copy leaves changed nested list aliased |
| Load valid, malformed and missing order files | Valid result succeeds; errors preserve causes; resource closes on failure | Empty success fallback, lost cause or leaked file |
| One-shot iterator used twice | One-pass design, explicit sequence contract, or justified materialization | Second pass silently empty |
| Async cancellation during a resource/effect stage | Cleanup and partial-state policy verified or explicitly unverified | Cancellation swallowed or remote rollback falsely claimed |
| Clean small function and private mutable builder | Retain existing interface and behavior | Unneeded classes, dependencies or purity rewrite |

## Additional decision cases from the second depth review

- A strict wire adapter receives NaN or repeated object names: enforce the declared parsing policy; parser success alone fails the validity claim.
- An exact decimal or large identifier crosses into a JavaScript consumer: preserve source precision and the agreed wire representation; converting a rounded value afterward fails.
- A local scheduling input has no timezone during an ambiguous clock change: establish its source and policy rather than silently attaching a guessed timezone.
- An offloaded synchronous write outlives a cancelled await: account for possible completion and retain resource ownership; claiming cancellation stopped the thread fails.

These are authored acceptance cases, not claims of executed integration evidence.

## Executed example evidence

On 2026-10-10, Python Markdown blocks were combined in an isolated temporary script and executed with Python 3.14.5. Assertions passed for valid decoding, invalid shape/bool/float/range rejection, nested input preservation and returned-list independence, empty input, loader success, malformed JSON cause and missing-file cause. Deleting the failed-load file succeeded on Windows, checking prompt closure in that scenario. No configured static type check, older-interpreter matrix, async/subprocess integration, or incremental skill-benefit claim follows from these example checks. Repository dependencies and user configuration were unchanged.

## Authorship and evaluation
Requirements originate in the approved Proofwork design and user preferences. The instructional text and workflow were written for these requirements; no upstream skill assets were imported or adapted. Official documentation linked in the skill supplies technical grounding only. Coordinator supplied a fresh Codex pre-skill baseline at evals/results/baseline.txt: pure input handling, Python mutable-default avoidance, Rust recoverable input errors, and generic frontend critique already worked. It did not establish Proofwork-specific routing, rendered design iteration, integration, or host parity. Detailed scenario prompts/rubrics were recorded before authoring; that broad baseline does not count as running every listed case. Guided evaluation and full language/browser fixtures remain pending until artifacts demonstrate them.
