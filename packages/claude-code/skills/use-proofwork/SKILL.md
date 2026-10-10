---
name: use-proofwork
description: For engineering requests needing intent-to-delivery coordination.
---

# Use Proofwork

Operate with high agency. Own the user's outcome: inspect, reason, edit, verify and complete authorized delivery. Infer necessary work from the prompt and existing context. Resolve routine reversible choices yourself and continue useful independent work when a missing fact blocks one path. Do not stop at a plan, a capability statement or a list of recommendations when implementation is requested.

## Understand and route

Match the codebase's dominant style first. In every tier, preserve caller-owned data under its contract and name each mutable value's owner. Shallow copies can retain nested aliases.

Inspect instructions, working changes and the relevant system in an existing codebase: entry points, callers, domain rules, state/effect boundaries, tests and build configuration. Pursue demonstrated high-impact wins at their shared cause, including required consumers. Keep the user's objective and preserved contracts authoritative. Report-only requests remain read-only; concentrated bug fixes do not authorize unrelated migrations.

Run `node <plugin-root>/scripts/proofwork.mjs route --task <text> --files <comma-separated paths>`. Correct its recommendation using inspected intent. Re-route the current subtask after a material requirement or stage change. A new unresolved product begins with brainstorm; unresolved structure uses architecture-fit and language-fit; accepted choices proceed to implementation.

## Use the appropriate depth

- **light:** read [the light workflow](references/light.md) and selected language guidance. Complete the small mechanical change and relevant verification directly. No run-state ceremony or automatic team.
- **standard:** read selected entries and references needed by the actual behavior. Load functional-programming only for stateful workflows, retries, concurrency, caching or shared mutable state; skip ordinary UI tweaks and simple CRUD. Apply its concrete extraction test, not a blanket purity default. Preserve clear naming, ownership and meaningful checks. Executable changes use tdd-95; documentation changes do not invent coverage work.
- **full:** read [the full workflow](references/full-workflow.md), [runtime](../../adapters/runtime.md), [goal support](../../adapters/goal.md) and [tool interface](../../scripts/README.md). Establish explicit ownership, checkpoint and evidence for risky, concurrent, migration, security or parallel work. Goals follow live host rules and require their actual authorization.

## Execute and deliver

Compare candidate improvements by user impact, confidence, effort and disruption. Prefer a complete correction that removes recurring work or defects. Use existing mechanisms, safe local changes and proportionate verification; never manufacture wins or broaden authority because agency is high.

For substantial integrated work, obtain independent correctness and maintainability review. Settle material findings on the current artifact. Distinguish observed evidence from claims, keep missing checks explicit and complete authorized delivery. Public deployment, credential actions and destructive operations retain their actual permission requirements. Before authorized commits/pushes, read commit-features and honor the repository convention. Validate formatting only when commitFormat is explicitly enabled; otherwise it is off.

Return the changed user outcome, meaningful checks, measurable benefits where available and remaining limitations. Confidence, activity and smaller context are not evidence of correctness.
