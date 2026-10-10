# Detailed clean-code workflow

Read the applicable sections for the current transformation, restructuring, interface or writing decision. These details do not create a mandatory workflow for every small edit.

# Clean code

Make the behavior easier to locate and the next change safer. Prefer subtraction, direct domain names, and one clear owner over additional layers. Fewer lines are useful only when the remaining code still carries every required responsibility.

Read the canonical [engineering principles](../../../principles/engineering.md) and apply those relevant to the assignment. This skill does not create a competing quality verdict; substantial structural enforcement belongs to the coordinator's thermonuclear review.

Judge files by cohesive responsibility and actual change friction; no mandatory line ceiling applies. Preserve callers, initialization and resource ownership when splitting modules.

Use the optional file-length checker only for an explicit project policy or informative inventory. Record discovery and scope accurately; counts do not establish architecture quality.

## Keep functions short and direct

Functions need one understandable responsibility, explicit inputs/results and clear effect ownership. A longer cohesive function may be appropriate; a short dense function may still need restructuring.

Read [function cohesion and complexity](function-size-and-complexity.md) for meaningful extraction and preservation checks. Coordinate changes outside owned scope.

Keep ordinary formatting and useful explanations. Prefer pure calculations and explicit effect boundaries; do not add forwarding chains merely to make code shorter.

## Trace before judging

Read the requested behavior from entry point to result, including meaningful callers and effect boundaries. Find where the answer to a maintainer's question lives: “Who validates this value?”, “Who owns this state?”, “Where does this error go?”, or “Which rule chooses this outcome?”

Identify a concrete source of reader or change friction: duplicated policy, ambiguous state ownership, obsolete compatibility code, a wrapper that hides nothing, mixed domain and transport concerns, or a branch whose intent is unclear. A class is not a defect by itself. State the observable consequence before proposing a remedy.

## Simplify one responsibility at a time

For a DRY audit, load [dry-audit](../../dry-audit/SKILL.md). Prove repeated code owns the same rule before consolidating; retain distinct policies and necessary enforcement at separate trust boundaries.

For an explicit dead-code audit or removal task, load [dead-code-audit](../../dead-code-audit/SKILL.md). It covers supported runtime roots, dynamic consumers and cleanup of exclusively attached tests. A lack of search matches alone is not a deletion decision.

Read [refactoring decisions](../references/refactoring-decisions.md) for structural changes, wrapper removal, or duplicated rules. Choose the smallest change that puts a responsibility in its appropriate existing place. Remove dead paths only after checking callers, exports, configuration, tests, fixtures, and external contracts relevant to the deletion.

Unify decisions when they represent the same rule and change for the same reason. Similar-looking syntax may implement different policies; sharing it can couple unrelated behavior.

Prefer explicit control flow to clever compression. Use names that reveal the domain distinction and contracts that represent meaningful states. Keep pure calculations separate from effects where practical; clear loops and local mutation remain valid. Do not turn a focused cleanup into an architecture migration, generic utility layer, or new dependency.

## Preserve what users rely on

Read [contract-preserving refactors](../references/contract-preserving-refactors.md) when moving ownership changes signatures, errors, ordering, aliases or initialization. Distinguish source, wire and behavioral compatibility; verify the actual consumer/effect seam instead of accepting a compiling extraction alone.

When decomposing files, read the reference's cohesion probes. Check imports, initialization, shared-state identity and resource lifetime as well as migrated calls.

Before changing structure, identify the behavior that must survive: outputs, validation, failure context, ordering, resource cleanup, permissions, persistence, and public compatibility as applicable. A wrapper may be the only owner of logging, normalization, or cleanup even if its happy path appears redundant.

Use existing behavior tests. Add a focused public-behavior or integration check when the changed responsibility lacks meaningful protection. Do not freeze incidental implementation details to prove a refactor. Check the actual removal across callers; passing a unit test of the new helper cannot prove all consumers migrated.

## Report the result

Explain which responsibility became clearer, what disappeared, and how preserved behavior was checked. Link a remaining finding to its consequence and feasible fix. An already direct implementation can receive no changes. Do not manufacture findings to make the review seem substantial.

Inspect actual responsibilities, naming and control flow. Describe concrete reader burden and preserved behavior when proposing extraction; line counts alone cannot establish a maintainability defect.

Keep compatibility or safety debt visible when it cannot be removed within scope. A smaller diff with an acknowledged remaining risk is more useful than a broad cleanup that silently changes the contract.
