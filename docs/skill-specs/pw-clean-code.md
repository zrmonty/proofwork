# Clean code specification

## Contract-preservation decisions

Load references/contract-preserving-refactors.md when extraction changes signatures, errors, ordering, nested aliases or initialization. Distinguish source, wire and behavioral compatibility; identify actual supported consumers and one authoritative rule owner without speculative compatibility frameworks.

Acceptance: pure update extraction retains commit-before-notification semantics and observes the relevant failed effect through a caller. A new top-level object cannot be called an independent snapshot when mutable nested aliases still violate the contract; intentional resource identity need not be deep-copied.

## Purpose and trigger

Simplify implementation or review by removing unnecessary responsibility and indirection while preserving user-visible behavior, safety, and compatibility. A clean implementation may need no edit.

## Inputs and scope

Read the assignment, actual callers and boundaries, canonical engineering principles, existing conventions, and preserved contracts. Scope includes relevant exports, fixtures, configuration, and external compatibility of a deletion; it does not authorize an architecture rewrite.

## Required decisions

Separately identify the consequence of a complexity finding; classes and loops are not defects by themselves.
- Remove a mechanism only when its responsibility is unnecessary or has one explicit replacement owner.
- Share rules that change for the same domain reason; do not couple unrelated policies based on similar syntax.
- Prefer meaningful names, clear ownership, direct flow, and proportionate pure/effect boundaries over clever compression or speculative generic helpers.
- Preserve validation, failure context, ordering, cleanup, permissions, persistence, and compatibility that the changed code actually owns.
- Check real consumers and behavior, and route substantial structural quality enforcement to thermonuclear review.
- Decompose along public contracts and distinct reasons for change; inspect imports, initialization, shared-state identity and resource lifetime. A size-compliant split must not distribute one policy or introduce cycles and hidden effects.

## Progressive disclosure

references/refactoring-decisions.md supports wrapper evaluation, policy duplication, meaningful state, derived values, and targeted preservation checks. The canonical principles remain shared; this skill adds decision examples rather than another verdict system.

## Output and evidence

Report the clarified responsibility, removed mechanism, current-artifact preservation checks and material remaining concerns. No arbitrary file or function length ceiling applies. Preserve clear domain naming, cohesion, control flow, contracts and ordinary formatting.

## Acceptance cases

Existing cases are in evals/language-scenarios.md. Expanded decisions:

1. An unexported forwarding wrapper with no behavior is removed only after active consumers migrate.
2. A public adapter remains when external compatibility is outside scope, even if its happy path looks redundant.
3. Removing a wrapper preserves its sole error translation or cleanup owner.
4. Similar formatting branches with unrelated policies are not forced into a flag-driven universal helper.
5. Contradictory state flags receive a model/ownership fix, not just a shorter boolean expression.
6. A clear local loop and an already direct implementation within the size caps receive no invented complexity finding.
7. Targeted preservation checks exercise the responsibility that moved; implementation-mirroring tests do not substitute for integration.
8. Cohesive decomposition preserves behavior rather than compressing formatting or scattering forwarding helpers.
9. Ignored/custom code is added to discovery; an oversized file outside ownership is reported for coordination without a false repository-wide pass.
10. A cohesive split preserves initialization order, single state ownership, resource cleanup and test discovery; separate passing test files do not alone prove the combined runner is safe.
11. A concrete rule-change probe exposes surviving duplicate policy owners, while unrelated policies remain separate instead of sharing a speculative factory or facade.
12. Nested callbacks also count independently and within the enclosing definition.
13. An eight-line function contains dense nested expressions or unrelated effects: report a concrete complexity finding rather than accepting it solely on size.
14. A long function or test is split into cohesive decisions/adapters or meaningful fixtures while preserving unique error, cleanup and assertion contracts; minification or weakened tests fail.
15. A public signature cannot meet the limit within current compatibility scope: report the unresolved violation and required coordination rather than breaking callers or manufacturing a pass.

Reference map: references/function-size-and-complexity.md supports cohesive extraction, supported complexity findings and preserved consumer contracts; it contains no mandatory line cap.

## Evaluation status and authorship

Original Proofwork guidance. Acceptance includes intentionally clean cases so review is not rewarded for invented findings. A scenario's presence does not mean it was executed; parent evidence identifies performed checks and gaps.
