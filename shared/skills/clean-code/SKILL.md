---
name: clean-code
description: "Use for implementation cleanup or review; apply shared simplicity principles without inventing abstractions or changing behavior."
---

# Clean code

## Inputs
Read the requested scope, affected callers, existing conventions, and behavior-preservation requirements.

## Workflow
1. Read the canonical [engineering principles](../../principles/engineering.md). Apply only principles relevant to the actual change.
2. Trace the user's behavior through the implementation. Locate duplicated decisions, state with multiple owners, dead paths, and abstractions whose indirection has no current benefit.
3. Choose the smallest simplification that preserves validation, error handling, ordering, and compatibility. A deletion is useful only when its responsibility is no longer needed or lives in one clear place.
4. Prefer names that express domain meaning and direct control flow. Do not force function lengths, class hierarchies, reducers, or one-line expressions.
5. Run focused preservation checks. For a substantial structural change, request the independent thermonuclear review through the coordinator.

## Outputs
The simplified responsibility, proof of preserved behavior, and any concrete remaining finding. An already simple implementation can receive no changes.

## Boundaries
This skill grants no edit or publication authority beyond the task. Keep the thermonuclear review as the structural enforcement pass; do not create a competing verdict system. Useful local mutation and standard framework patterns remain valid.

## Behavioral cases
A redundant wrapper is removed with behavior evidence; a clean explicit loop stays; safety guards do not disappear to reduce line count. See language-scenarios.
