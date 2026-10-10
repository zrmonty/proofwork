# Clean code specification

## Purpose and trigger

Simplify implementation or review by removing unnecessary responsibility and indirection while preserving user-visible behavior, safety, and compatibility. A clean implementation may need no edit.

## Inputs and scope

Read the assignment, actual callers and boundaries, canonical engineering principles, existing conventions, and preserved contracts. Scope includes relevant exports, fixtures, configuration, and external compatibility of a deletion; it does not authorize an architecture rewrite.

## Required decisions

- Trace behavior and locate a concrete maintainer question whose answer is scattered or obscured.
- State a consequence before labeling code defective; function length, classes, and loops are not findings by themselves.
- Remove a mechanism only when its responsibility is unnecessary or has one explicit replacement owner.
- Share rules that change for the same domain reason; do not couple unrelated policies based on similar syntax.
- Prefer meaningful names, clear ownership, direct flow, and proportionate pure/effect boundaries over clever compression or speculative generic helpers.
- Preserve validation, failure context, ordering, cleanup, permissions, persistence, and compatibility that the changed code actually owns.
- Check real consumers and behavior, and route substantial structural quality enforcement to thermonuclear review.

## Progressive disclosure

references/refactoring-decisions.md supports wrapper evaluation, policy duplication, meaningful state, derived values, and targeted preservation checks. The canonical principles remain shared; this skill adds decision examples rather than another verdict system.

## Output and evidence

Report the clarified responsibility, removed mechanism, current-artifact preservation evidence, and material remaining findings with feasible remedies. Enforce the explicit 500-physical-line code-file maximum; invent no additional size, style or novelty demands. Comments, blanks, tests, scripts, generated and already oversized project code count; no exception or inventory manipulation raises the limit.

## Acceptance cases

Existing cases are in evals/language-scenarios.md. Expanded decisions:

1. An unexported forwarding wrapper with no behavior is removed only after active consumers migrate.
2. A public adapter remains when external compatibility is outside scope, even if its happy path looks redundant.
3. Removing a wrapper preserves its sole error translation or cleanup owner.
4. Similar formatting branches with unrelated policies are not forced into a flag-driven universal helper.
5. Contradictory state flags receive a model/ownership fix, not just a shorter boolean expression.
6. A clear local loop and an already direct implementation receive no finding.
7. Targeted preservation checks exercise the responsibility that moved; implementation-mirroring tests do not substitute for integration.
8. A 500-line code file passes the size gate; 501 fails. Cohesive decomposition preserves behavior rather than compressing formatting or scattering forwarding helpers.
9. Ignored/custom code is added to discovery; an oversized file outside ownership is reported for coordination without a false repository-wide pass.

## Evaluation status and authorship

Original Proofwork guidance. Acceptance includes intentionally clean cases so review is not rewarded for invented findings. A scenario's presence does not mean it was executed; parent evidence identifies performed checks and gaps.
