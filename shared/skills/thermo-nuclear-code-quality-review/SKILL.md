---
name: thermo-nuclear-code-quality-review
description: When judging structural quality of substantial integrated changes.
---

# Thermonuclear maintainability review

Determine whether the implementation makes the domain easier to understand and change. Find a simpler model or clearer owner while preserving behavior. No file/function length ceiling or criticism quota applies.

## Establish the reviewed contract

Name the reviewed paths, comparison base and dirty content. Inspect callers, tests, configuration and existing utilities. Load relevant language and functional guidance. Reviews are read-only unless repairs are authorized; inspection does not authorize external comments.

Trace a representative success and failure path. Inspect invariant ownership, earned interfaces, explicit states/effects, dependency direction, concurrent writers, partial failure and cleanup. A short function or a split file is not independently evidence of quality.

Read [structural review](references/structural-review.md) for applicable probes and clean cases. Read [finding disposition](references/finding-disposition.md) when a concern is disputed or a repair claims closure. Require observed responsibility and current consumer context, not speculative architecture preferences.

## Make the concern actionable

Each finding names a location, observed mechanism, practical maintenance consequence, smallest adequate remedy and behavior to preserve. Distinguish demonstrated defects, supported structural concerns and unanswered questions. Prefer cohesive pure decisions and explicit resource boundaries. Do not manufacture helper chains, compress code or add frameworks to satisfy cosmetic metrics.

Verify the changed consumer and failure seam after authorized repairs. Recheck integrated ownership after later changes. Missing runtime evidence remains separate from a source-level maintainability conclusion.

Give exactly one verdict:

- **meets the bar:** the reviewed structure is understandable and appropriate, with no unresolved material structural concern.
- **needs restructuring:** a demonstrated ownership/model/complexity problem prevents acceptance; name its practical consequence and smallest adequate correction.
- **insufficient evidence:** missing context prevents judging a material claim; name what observation would resolve it.

Report actual scope, current-artifact checks and material gaps. A clean result is valid. Project-specific size policies may be measured separately, but counts do not establish maintainability.
