---
name: use-proofwork
description: Use when the user invokes Proofwork, requests a coordinated engineering team, or resumes a goal or checkpoint already using Proofwork.
---

# Use Proofwork

Own the result from task discovery through integrated verification. Every worker carries the same engineering standards. Prefer less code, explicit data, pure decisions and evidence over ceremony.

## Start and route

1. Resolve this installed package's root: two directories above this skill folder. Read [runtime](../../adapters/runtime.md), [goal](../../adapters/goal.md), and the packaged [tool reference](../../scripts/README.md). Use only capabilities actually available. Bare `/use-proofwork` is the product entry concept; the host adapter gives its supported invocation syntax.
2. Read applicable project instructions, the user's objective, supplied design, working-tree changes, relevant callers and checks. Existing authorization persists. A mode invocation alone does not create a native goal; attach to an active goal and preserve its objective.
3. Automatically execute the bundled router through the host shell, supplying task text and affected file paths as separate, safely quoted arguments:

```text
node <plugin-root>/scripts/proofwork.mjs route --task <text> --files <comma-separated paths>
```

4. Read the returned playbook and skill files inside this package before acting. Always load worker-mode, functional-programming, data-driven-development and clean-code; routing adds languages/frontend/review as applicable. Correct an inappropriate route from observed scope and record why. Missing files/tools are concrete capability gaps, not successful routing.
5. Define observable criteria and a smallest complete scope. Run setup if capabilities, role models or repository checks are unknown. Read [assignment](../../contracts/assignment.md), [worker result](../../contracts/worker-result.md), [evidence](../../contracts/evidence.md), and [run state](../../contracts/run-state.md).

## Coordinate

Initialize or recover a unique local run using the tool reference. Persist `use-proofwork` as the active mode and keep objective/design, selected skills, ownership, evidence and next action in the checkpoint. Only the coordinator writes aggregate state. Inspect repository identity and actual workers before resuming; saved IDs and prior summaries are insufficient.

For independent work, dispatch bounded assignments with explicit files, checkout, criteria, selected skill paths, and result location. Tell every fresh worker to read worker-mode and those skills. Respect the host's capacity; default ceiling is three workers plus coordinator. Use fewer for small tasks. No nested delegation without bounded coordinator authorization. Independent agents without a shared assignment remain independent runs.

Shared interfaces are agreed before dependent edits. Disjoint owners may share a checkout; overlapping edits or competing implementations require isolation. Integrate one accepted result at a time. Inspect actual diffs and evidence, then check the combined result. Resolve ownership conflicts instead of overwriting another agent. Record requested/actual models where exposed; unavailable metadata is unknown. Cross-provider work needs an explicitly configured bridge.

## Review, verify, continue

Independent correctness and thermonuclear review cover substantial changes and combined parallel work. A modest change can use one independent reviewer for both responsibilities. Accept or reject material findings with reasons; verify fixes and re-review affected code. After two failed attempts on one premise, investigate that premise. Lightweight cleanup remains part of every worker's job.

Evidence must describe the current integrated artifact. Invalidate affected evidence after code/dependency changes. Required frontend criteria include actual rendered desktop/mobile and interaction checks. Continue useful independent work when one capability is missing; report the unproved criterion precisely.

Checkpoint before dispatch, after integration/review/checks, and before yielding. On native goal continuation reload this skill, adapters and checkpoint, reconcile live work and uncertain external effects, and take the next useful step. Follow the host's actual goal contract: create only on explicit request, budget only if supplied, pause only on explicit request, and blocked only when its required conditions hold. Resource limits leave incomplete work, never completion. No second scheduler or goal loop.

Before every authorized commit or push, read [commit-features](../commit-features/SKILL.md), inspect the actual outgoing range, and include `Major features` and `Minor features` sections (`None` when empty). These describe changes, not inferred semantic versions. Run `node <plugin-root>/scripts/check-commits.mjs --repo <path> --range <range>` against the resulting range before push or final delivery.

Finish only when required criteria have current evidence, material findings are resolved, all modifying workers are collected, and authorized delivery is complete. Use the CLI completion guard and the native goal completion operation where applicable; passing one does not establish the other. Report outcome, meaningful evidence and remaining limitations. A review-only objective ends with a scoped report, without edits or external posting.
