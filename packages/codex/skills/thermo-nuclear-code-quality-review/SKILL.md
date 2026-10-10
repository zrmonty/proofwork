---
name: thermo-nuclear-code-quality-review
description: Use when reviewing substantial Proofwork changes, integrated parallel work, refactors, or an explicitly requested demanding maintainability audit.
---

# Thermonuclear maintainability review

Determine whether the implementation makes the problem easier to understand and change. Seek a smaller model or clearer owner that eliminates mechanisms. This is an evidence-based review, not a quota of criticism.

Establish the reviewed paths, comparison base and inclusion of uncommitted work. Read changed code with callers, tests, contracts and existing utilities. Load relevant language and functional-programming guidance. Review-only authorization permits inspection/reporting, not edits, external comments or formal posted reviews. Include older issues only where this change depends on or worsens them.

Inspect these structural questions:

- Does each invariant have one owner? Can explicit states remove contradictory optional fields, repeated predicates or scattered flags?
- Do helpers hide a useful contract, or merely forward and multiply concepts? Does an existing utility already own the operation?
- Can domain decisions be pure without hiding time, randomness or mutation? Are external effects and partial failures visible?
- Would the proposed reduction preserve validation, errors, ordering, cancellation, concurrency and public compatibility?
- Are proposed parallel steps actually independent in writes, dependencies and failure behavior?

Measure relevant hand-authored files at base and result. Crossing from below 1,000 lines to above 1,000 is a presumptive blocker: require a cohesive decomposition or an explicit compelling structural exception. Investigate responsibility boundaries before recommending a split. Generated artifacts are assessed through their generator. Growth in an already large file also deserves scrutiny; line count alone never proves a runtime defect.

A finding contains location, observed mechanism, practical maintenance cost, feasible remedy, and behavior that must survive. Show what disappears in a restructuring; moving identical complexity into more files is not evidence of improvement. Preserve boundary guards and errors even when deletion would shorten the diff. Do not demand a new framework, abstraction or whole-system rewrite without demonstrated need.

Lead with the highest-impact findings, separate demonstrated concerns from unanswered questions, and give exactly one maintainability verdict: **meets the bar**, **needs restructuring**, or **insufficient evidence**. An exception to a presumptive blocker is explicit and justified. Missing context that prevents evaluating a claimed simplification warrants insufficient evidence. Clean code earns meets the bar without invented findings.

Report checks actually performed and material gaps. Passing tests supports behavior claims but does not settle maintainability. This verdict is separate from correctness and security. Authorized revisions receive focused verification and review of changed findings; the coordinator owns disposition and integrated completion.
