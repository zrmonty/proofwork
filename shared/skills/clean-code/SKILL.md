---
name: clean-code
description: Simplify implementations and reviews by removing unnecessary responsibilities and indirection while preserving behavior, safety, and compatibility.
---

# Clean code

Make the behavior easier to locate and the next change safer. Prefer subtraction, direct domain names, and one clear owner over additional layers. Fewer lines are useful only when the remaining code still carries every required responsibility.

Read the canonical [engineering principles](../../principles/engineering.md) and apply those relevant to the assignment. This skill does not create a competing quality verdict; substantial structural enforcement belongs to the coordinator's thermonuclear review.

Keep every project code file at **500 physical lines or fewer**, including comments and blank lines. This is a hard maximum, not a review preference: 501 fails. It covers implementation, tests, scripts and generated application code, including existing oversized files. Split along cohesive responsibilities and preserve contracts; do not minify, combine unrelated statements, strip useful explanation or exclude files to evade the limit. Adjust generators when their output exceeds the maximum. External dependencies and prose/data artifacts are not project code; custom or ignored project code still counts.

Run `node <plugin-root>/scripts/check-file-lines.mjs --repo <repo> [--inventory <additional-code-paths.json>]`. Inspect discovery and add custom, extensionless or ignored application code to its additive inventory. The checker cannot identify every language or prove architectural quality. An existing violation outside the assignment's ownership must be reported and coordinated; do not silently grandfather it, claim the repository passes, or rewrite another owner's files without scope.

## Trace before judging

Read the requested behavior from entry point to result, including meaningful callers and effect boundaries. Find where the answer to a maintainer's question lives: “Who validates this value?”, “Who owns this state?”, “Where does this error go?”, or “Which rule chooses this outcome?”

Identify a concrete source of reader or change friction: duplicated policy, ambiguous state ownership, obsolete compatibility code, a wrapper that hides nothing, mixed domain and transport concerns, or a branch whose intent is unclear. A long function or a class is not a defect by itself. State the observable consequence before proposing a remedy.

## Simplify one responsibility at a time

Read [refactoring decisions](references/refactoring-decisions.md) for structural changes, wrapper removal, or duplicated rules. Choose the smallest change that puts a responsibility in its appropriate existing place. Remove dead paths only after checking callers, exports, configuration, tests, fixtures, and external contracts relevant to the deletion.

Unify decisions when they represent the same rule and change for the same reason. Similar-looking syntax may implement different policies; sharing it can couple unrelated behavior. Extract a function when a useful domain name or a single policy owner makes the code easier to follow, not because a block crossed an arbitrary length limit.

Prefer explicit control flow to clever compression. Use names that reveal the domain distinction and contracts that represent meaningful states. Keep pure calculations separate from effects where practical; clear loops and local mutation remain valid. Do not turn a focused cleanup into an architecture migration, generic utility layer, or new dependency.

## Preserve what users rely on

Before changing structure, identify the behavior that must survive: outputs, validation, failure context, ordering, resource cleanup, permissions, persistence, and public compatibility as applicable. A wrapper may be the only owner of logging, normalization, or cleanup even if its happy path appears redundant.

Use existing behavior tests. Add a focused public-behavior or integration check when the changed responsibility lacks meaningful protection. Do not freeze incidental implementation details to prove a refactor. Check the actual removal across callers; passing a unit test of the new helper cannot prove all consumers migrated.

## Report the result

Explain which responsibility became clearer, what disappeared, and how preserved behavior was checked. Link a remaining finding to its consequence and feasible fix. An already direct implementation can receive no changes. Do not manufacture findings to make the review seem substantial.

Keep compatibility or safety debt visible when it cannot be removed within scope. A smaller diff with an acknowledged remaining risk is more useful than a broad cleanup that silently changes the contract.
