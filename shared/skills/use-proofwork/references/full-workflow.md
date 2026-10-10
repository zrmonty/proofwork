# Full coordination and verification workflow

Use for full-tier work, parallel ownership and integrated review. Own the user's outcome, not agent count or passing-command count. Users steer intent/taste/judgment; carry engineering detail and recommend the simplest adequate mechanism. Resolve routine reversible details; surface choices affecting experience, cost, ownership, recovery or explicit requirements using [intent and judgment](intent-and-judgment.md).

## Establish the task and stage

Resolve the package root and read actual [runtime](../../../adapters/runtime.md), [goal](../../../adapters/goal.md) and [tool](../../../scripts/README.md) interfaces. Inspect project instructions, dirty changes, behavior and callers. Preserve authorization/active objectives. Define observable criteria, consequential failures and evidence that could contradict success. Report actual inspected scope, never imply universal coverage.

```text
node <plugin-root>/scripts/proofwork.mjs route --explain --task <text> --files <comma-separated paths>
```

Quote task/files separately. Read selected skills/playbook and correct routing using actual intent/artifact. New unresolved direction uses brainstorm; unsettled boundaries use architecture-fit; unsettled technologies use language-fit before scaffolding. Accepted direction proceeds without reopening settled decisions. Investigation/choice-only requests return their scoped deliverable rather than silently implementing/deploying.

Reroute material answers/stage changes with the current subtask; checkpoint selected guidance/next action while retaining objective, authority and unaffected evidence. Missing guidance/tools is a capability gap; use setup where necessary. Coordinators load data-driven-development and pw-clean-code; assigned workers load pw-worker-mode; language/UI guidance follows actual scope. Functional guidance is conditional on stateful/shared/retry/cache work, matches incumbent style and extracts for three meaningful states/event types, real partial failure/retry or framework-independent decision testing.

Executable changes use [tdd-95](../../tdd-95/SKILL.md): independent source scope, actual line/branch gates and stricter incumbent requirements. Missing metrics/below-gate legacy targets stay incomplete. Documentation does not need executable coverage. Optimization uses [performance-increase](../../performance-increase/SKILL.md) and reports comparable before/after correctness/timing, variability, practical meaning and regressions or unavailable baselines.

## Ownership before dispatch

Use [audit-stack](../../audit-stack/SKILL.md) to coordinate audit lenses within this run, not recursively redispatch. Load focused dead-code/DRY/security lenses where appropriate; preserve their distinct completion gaps and credential/live-check limits.

Read [assignment](../../../contracts/assignment.md), [worker result](../../../contracts/worker-result.md), [evidence](../../../contracts/evidence.md) and [run state](../../../contracts/run-state.md). Initialize a unique run or reconcile an existing one. Coordinator alone writes aggregate state; workers return separate results.

Handle bounded changes directly. Delegate independent slices after shared interfaces stabilize. Default at most three workers plus coordinator, reduced to host limits; nested delegation needs bounded authorization. Assign checkout, owned/excluded paths, dependencies, criteria, skills, checks and result location. Disjoint writes may share a checkout; overlapping implementations need isolation/sequential integration. Coordinator owns regenerated output unless generation is explicitly assigned. Read [coordination](coordination.md) before substantial dispatch.

## Challenge the integrated artifact

Use [acceptance changes](acceptance-changes.md) when requirements/evidence change. Collect artifacts/evidence, inspect callers and integrate accepted results sequentially without overwriting ownership. Track semantic dependencies such as schema, defaults, localization and retry policy; inform consumers and revalidate changed assumptions.

Substantial/parallel work receives independent correctness and thermonuclear maintainability review, with distinct verdicts even from one reviewer. Fix/verify material findings or reject with supported reasons. Repeated failures require investigating the underlying assumption.

Capture integrated identity including dirty content. Current revision must resolve to HEAD where Git exists; labels/snapshots cover projects without HEAD. Revalidate after changes; never treat unchanged HEAD as unchanged content. Coordinator acceptance is required for reviewed status. Evidence records criterion, identity, environment, command/interaction and observations, including failures. Compilation/screenshots cannot prove the full flow; frontend criteria require rendered widths/interactions. Missing access leaves specific gaps explicit.

## Continue and deliver

Checkpoint before dispatch, after integration/review/checks and before yielding. For interruption, read [recovery](recovery.md), reload skill/adapters and inspect checkout, workers and uncertain effects. Saved identifiers do not prove liveness; missing success records do not prove external failure.

Use native goals only when requested; budgets/pause/blocked follow actual host conditions. No replacement scheduler. Limits preserve incomplete checkpoints.

With an explicitly installed lifecycle package, pass `--host codex|claude-code --session <actual-host-session>`
to full-run `init`; it writes the binding automatically. Never guess session IDs or choose the newest run.
Hooks recover context; they neither create goals nor authorize resuming stopped work. `preflight` inspects completion
without writes. Before an incomplete final report, checkpoint `awaiting-input` or `stopped-incomplete` so Stop does
not request continuation of a reviewing/verifying run.

Commits follow repository convention. [commit-features](../../commit-features/SKILL.md) formatting/checking applies only when `commitFormat` is explicitly enabled; absent means off. Do not automatically rewrite messages or block pushes with an unrequested format. Commit/push still requires existing authorization.

Before completion collect modifying workers, inspect final artifacts, obtain current evidence, settle findings/effects and complete authorized delivery. Run the local completion guard against integrated identity, then perform native completion separately. Structural guards cannot establish evidence honesty or worker liveness. Report outcome, meaningful checks and remaining limits.

Produce the [systems outcome](../../../contracts/systems-outcome.md) before final delivery, including incomplete runs. Link actual evidence, recovery, input/drift and signal records, residual risks and operator ownership. This artifact does not replace preflight or native completion.
