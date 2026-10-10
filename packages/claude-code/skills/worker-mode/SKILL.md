---
name: worker-mode
description: Implement or investigate a bounded Proofwork assignment, preserve other workers' ownership, and return a revision-bound artifact with observed evidence.
---

# Worker mode

Own the assigned behavior and make your result easy to inspect. A confident summary cannot replace an artifact, and a task that passes in isolation is still provisional until integration.

## Understand before writing

Read the [assignment](../../contracts/assignment.md), this skill and every selected skill explicitly; inherited context may omit constraints. Load [functional-programming](../functional-programming/SKILL.md), [clean-code](../clean-code/SKILL.md), [data-driven-development](../data-driven-development/SKILL.md) and affected language guidance. UI work also reads [frontend-design](../frontend-design/SKILL.md) and the agreed design direction.

Confirm the allowed checkout, owned paths, base/content identity, criteria and result destination. Inspect current changes before edits. If ownership or acceptance is missing, resolve that gap before writes rather than interpreting broad task language as permission to edit another worker's files.

Trace the behavior through callers, tests, fixtures, exports and configuration. Ask what must remain true at the boundary: validation, compatibility, ordering, cancellation, resource cleanup and error behavior. Reuse existing utilities when their contract fits. Include required consumers in the scope; changing only the definition can leave a broken feature.

## Implement the smallest complete behavior

For a bug, reproduce the reported failure before editing and trace the owning rule. For a feature, identify states and observable outcomes. For a refactor, establish the behavior to preserve and the complexity that will disappear. A review assignment is read-only unless edits are authorized.

Prefer pure decisions with explicit inputs and preserved caller data. Keep clocks, randomness, I/O and shared mutation at visible boundaries. Use explicit state transitions where they prevent contradictory states or duplicate effects. Clear loops and local mutation are valid; do not introduce a functional framework or repeatedly copy large data merely to avoid mutation syntax.

Write meaningful checks for new nontrivial decisions, parsers, security/money behavior or scripts. A regression should fail for the original behavior and exercise the user's scenario. Cover neighboring behavior when the fix changes a shared contract or error path. Use project checks and record what each check supports; do not claim a type check from a runtime test.

For scope conflicts, test failures, interrupted work and worked result examples, read [execution and handoff](references/execution.md) when those situations arise.

## Preserve ownership and return evidence

Edit only assigned paths. If a needed change belongs to another owner, report the required interface or path to the coordinator and continue independent assigned work. Do not overwrite shared/generated output, revert another worker, write aggregate run state, conclude the team goal or start nested workers without authorization.

Before returning, inspect the actual diff and remove demonstrated duplication, unnecessary forwarding and misleading names. Preserve failure handling and observable behavior while simplifying. Explain material departures from the agreed design or functional default; a useful reason names the clarity, compatibility or measured performance tradeoff.

Verify the hard 500-line maximum from clean-code, including owned tests and generated code. Return actual counts and checker discovery gaps with your evidence. A 501-line file is not ready for acceptance; decompose it within ownership or return the unresolved violation for coordination. Never compress formatting or alter the inventory to create a passing count.

Return the [worker-result](../../contracts/worker-result.md) with checkout/content identity, changed paths, fulfilled criteria, actual commands and observations, evidence locations, unresolved findings and next action. Include requested/actual models only when exposed; otherwise say unknown. Never label unexecuted checks as passing. `ready-for-review` means the artifact is ready to evaluate, not that the team's objective is complete.
