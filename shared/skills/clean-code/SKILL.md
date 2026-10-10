---
name: clean-code
description: Simplify implementations and reviews, enforce a hard ten-line function cap and clear responsibilities, and preserve behavior, safety and compatibility.
---

# Clean code

Make the behavior easier to locate and the next change safer. Prefer subtraction, direct domain names, and one clear owner over additional layers. Fewer lines are useful only when the remaining code still carries every required responsibility.

Read the canonical [engineering principles](../../principles/engineering.md) and apply those relevant to the assignment. This skill does not create a competing quality verdict; substantial structural enforcement belongs to the coordinator's thermonuclear review.

Keep every project code file at **500 physical lines or fewer**, including comments and blank lines. This is a hard maximum, not a review preference: 501 fails. It covers implementation, tests, scripts and generated application code, including existing oversized files. Split along cohesive responsibilities and preserve contracts; do not minify, combine unrelated statements, strip useful explanation or exclude files to evade the limit. Adjust generators when their output exceeds the maximum. External dependencies and prose/data artifacts are not project code; custom or ignored project code still counts.

Run `node <plugin-root>/scripts/check-file-lines.mjs --repo <repo> [--inventory <additional-code-paths.json>]`. Inspect discovery and add custom, extensionless or ignored application code to its additive inventory. The checker cannot identify every language or prove architectural quality. An existing violation outside the assignment's ownership must be reported and coordinated; do not silently grandfather it, claim the repository passes, or rewrite another owner's files without scope.

## Keep functions short and direct

Every project function must contain **at most 10 physical lines**. Exactly 10 passes; 11 fails. Count the complete definition, from its first attached attribute/decorator or signature line through the end of its body, including multiline signatures, comments and blank lines. For expression-bodied functions, count the full expression. Methods, constructors, accessors, local functions, closures/callbacks, test functions and generated functions are included; existing oversized functions have no grandfathering. Third-party code outside project ownership is excluded.

Read [function size and complexity](references/function-size-and-complexity.md) when implementing, extracting or auditing functions. Remove dead/repeated work first, then split genuine decisions and effects into cohesive named operations. Preserve return/error semantics, evaluation order, input ownership, authorization, cleanup and public compatibility. An oversized function outside owned scope must be reported and coordinated; do not claim a repository-wide pass or rewrite another owner's code silently.

The cap does not permit compressed statements, minification, stripped useful explanation or exclusion tricks. Keep ordinary formatter output. A function under 10 lines can still be overly complex: it must have one clear job, explicit inputs and outcomes, shallow understandable control flow and no dense nested expressions or unrelated side effects. Prefer pure calculations and state transitions with effectful adapters. Do not manufacture forwarding helpers or change a public API merely to squeeze a signature under the limit; resolve its scope/contract conflict explicitly.

## Trace before judging

Read the requested behavior from entry point to result, including meaningful callers and effect boundaries. Find where the answer to a maintainer's question lives: “Who validates this value?”, “Who owns this state?”, “Where does this error go?”, or “Which rule chooses this outcome?”

Identify a concrete source of reader or change friction: duplicated policy, ambiguous state ownership, obsolete compatibility code, a wrapper that hides nothing, mixed domain and transport concerns, or a branch whose intent is unclear. A function over the 10-line cap is a size violation; separately explain any complexity or ownership defect. A class is not a defect by itself. State the observable consequence before proposing a remedy.

## Simplify one responsibility at a time

For a DRY audit, load [dry-audit](../dry-audit/SKILL.md). Prove repeated code owns the same rule before consolidating; retain distinct policies and necessary enforcement at separate trust boundaries.

For an explicit dead-code audit or removal task, load [dead-code-audit](../dead-code-audit/SKILL.md). It covers supported runtime roots, dynamic consumers and cleanup of exclusively attached tests. A lack of search matches alone is not a deletion decision.

Read [refactoring decisions](references/refactoring-decisions.md) for structural changes, wrapper removal, or duplicated rules. Choose the smallest change that puts a responsibility in its appropriate existing place. Remove dead paths only after checking callers, exports, configuration, tests, fixtures, and external contracts relevant to the deletion.

Unify decisions when they represent the same rule and change for the same reason. Similar-looking syntax may implement different policies; sharing it can couple unrelated behavior. To meet the function cap, extract cohesive operations with useful domain names and a clear owner, rather than distributing one decision across arbitrary fragments.

Prefer explicit control flow to clever compression. Use names that reveal the domain distinction and contracts that represent meaningful states. Keep pure calculations separate from effects where practical; clear loops and local mutation remain valid. Do not turn a focused cleanup into an architecture migration, generic utility layer, or new dependency.

## Preserve what users rely on

Read [contract-preserving refactors](references/contract-preserving-refactors.md) when moving ownership changes signatures, errors, ordering, aliases or initialization. Distinguish source, wire and behavioral compatibility; verify the actual consumer/effect seam instead of accepting a compiling extraction alone.

When decomposing files, read the reference's cohesion probes. Check imports, initialization, shared-state identity and resource lifetime as well as migrated calls. Keep one responsibility authoritative; meeting the 500-line maximum by distributing the same rule across files does not resolve its maintenance cost.

Before changing structure, identify the behavior that must survive: outputs, validation, failure context, ordering, resource cleanup, permissions, persistence, and public compatibility as applicable. A wrapper may be the only owner of logging, normalization, or cleanup even if its happy path appears redundant.

Use existing behavior tests. Add a focused public-behavior or integration check when the changed responsibility lacks meaningful protection. Do not freeze incidental implementation details to prove a refactor. Check the actual removal across callers; passing a unit test of the new helper cannot prove all consumers migrated.

## Report the result

Explain which responsibility became clearer, what disappeared, and how preserved behavior was checked. Link a remaining finding to its consequence and feasible fix. An already direct implementation can receive no changes. Do not manufacture findings to make the review seem substantial.

Report function-size inspection scope and method separately from file-size checks. Use an available language-aware checker or inspect actual definition boundaries; text search alone can miscount strings, nesting or multiline declarations. The bundled check-file-lines.mjs checks the 500-line file cap, not the 10-line function cap. Missing function analysis remains a named gap; no passing build proves compliance.

Keep compatibility or safety debt visible when it cannot be removed within scope. A smaller diff with an acknowledged remaining risk is more useful than a broad cleanup that silently changes the contract.
