---
name: thermo-nuclear-code-quality-review
description: Assess structural maintainability of substantial changes, combined parallel work or an explicit demanding audit; identify supported simplifications and give a clear scoped verdict.
---

# Thermonuclear maintainability review

Determine whether the implementation makes the domain easier to understand and change. Look for a smaller model or clearer owner that removes mechanisms while preserving behavior. This is a demanding review, not a quota of criticism or a preference for short files.

## Establish what you can judge

Name the reviewed paths, comparison base and inclusion of uncommitted work. Inspect the diff with relevant callers, contracts, tests and existing utilities. Load applicable language and functional-programming guidance. Review is read-only unless edits are authorized; inspection does not authorize external comments or formal posted reviews. Include older issues only when the change depends on or worsens them.

Find the important rule before proposing a shape. Where is it represented? Which paths can violate it? Which failure paths and public contracts must survive? Tests help establish behavior; they do not settle whether responsibilities are coherent. Missing code or evidence that prevents evaluating a material restructuring produces an explicit gap.

## Test the structure

Trace a representative success and failure path, then examine the pressure points:

- **Invariant ownership:** Is one rule maintained in several places? Can explicit states prevent contradictory fields or repeated predicates? A new type is useful only if callers stop handling invalid combinations themselves.
- **Earned interfaces:** Does a helper encapsulate a domain operation or resource boundary, or forward arguments through another name? Does an existing utility already own the operation? Identify what becomes easier to change if the interface remains.
- **Effects and state:** Can domain decisions be pure with explicit dependencies? Are partial failure, cancellation, shared mutation and retry visible? Removing a wrapper is unsafe if it owns cleanup or ordering.
- **Dependency direction:** Can a reader follow the rule without traversing unrelated layers? Does a module depend on a concrete adapter where a narrow boundary would isolate effects, or is an abstraction adding indirection without a real consumer?
- **Concurrency:** Are writers and shared outputs actually separated? Are checks and writes susceptible to races? Sequential execution or local mutation can be the clearest correct choice.

For detailed review probes, worked findings and clean cases, read [structural review examples](references/structural-review.md) when the implementation has those shapes. Use its questions to investigate; do not report hypothetical defects as demonstrated findings.

Measure relevant hand-authored files at base and result. Crossing from below 1,000 lines to above 1,000 is a presumptive blocker: require cohesive decomposition or an explicit compelling structural exception. Investigate responsibilities before recommending a split. Generated files are assessed through their generator. Growth in an already large file deserves scrutiny; line count alone does not prove a runtime defect. Preserve the literal below/above threshold rather than converting it into an arbitrary maximum.

## Make findings actionable

Each finding names a location, observed mechanism, practical maintenance cost, feasible remedy and behavior that must survive. Tie the cost to a real kind of change or failure, such as updating a validation rule in three owners. Show what disappears: duplicate rules, contradictory states, forwarding layers or hidden effects. Moving unchanged complexity into more files is not enough.

Distinguish a demonstrated defect, a supported structural concern and an unanswered question. Prioritize by consequence and likelihood, not stylistic intensity. Do not demand a framework, new dependency, whole-system rewrite or unchecked guard deletion without demonstrated need. If the simplest safe improvement is local, recommend it. If a remedy lacks evidence, state the uncertainty rather than disguising it as a prescription.

Lead with material findings and give exactly one maintainability verdict:

- **meets the bar:** scoped structure is understandable and appropriate; no unresolved material structural concern remains. A clean result needs no invented findings.
- **needs restructuring:** a demonstrated material ownership/model problem or unaddressed threshold presumption prevents acceptance. Name the smallest adequate change and preservation checks.
- **insufficient evidence:** missing context prevents judging a material claim. Name the missing artifact or observation and what decision it would resolve.

An exception to a presumptive blocker must be explicit and justified. Report checks actually performed and material gaps. This verdict covers scoped maintainability, separately from correctness and security. On authorized revisions, verify the changed behavior and review the original finding plus nearby consequences; the coordinator owns final disposition and integrated completion.
