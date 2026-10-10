# Specification: worker-mode

## Purpose and inputs

Execute an assigned behavior with the same engineering discipline as the coordinator, preserve other owners and return a reviewable artifact. Inputs are the assignment, checkout/current changes, base/content identity, criteria, selected skills, tools and limits.

## Decision contract

Explicitly read assigned skills and ownership before writes. Inspect owning behavior plus consumers, fixtures, exports/config and error paths. Bug work reproduces the failure; feature work names observable states; refactoring identifies preserved behavior and removed complexity. Pure decisions and explicit effects are preferred without introducing a framework or unnecessary copying. Meaningful checks support specific claims, and a cleanup pass preserves validation, ordering and resource behavior.

A worker writes only owned files and its result, reports necessary shared changes to the coordinator and never concludes the team goal. Result identity includes relevant dirty content. Status and gaps are honest; ready-for-review remains provisional. Conditional execution/handoff examples live in references/execution.md, with schemas centralized in the worker-result/evidence contracts.

## Observable acceptance cases

- A fresh worker names loaded skill assets, inspects current changes and refuses writes when ownership/criteria are missing.
- An export regression observes the original truncation and checks multi-page behavior plus relevant boundaries without creating an unrelated abstraction.
- A UI worker needing another owner's schema reports the expected field/semantics, continues independent work and does not edit or fake the shared response.
- A stateful assignment distinguishes pure transition decisions from effect persistence and tests requested failure/retry behavior; pure syntax alone does not establish idempotency.
- A runtime test is not described as type checking; missing browser/service access is recorded as an unproved criterion rather than a passing substitute.
- A clear local loop is accepted when appropriate; an unexplained shared mutation or expensive copying model is challenged through the relevant standards.
- An interrupted worker preserves its artifact and last actual observation, reports an uncertain process stop and does not restore aggregate state or replay unknown effects.
- A result lists changed paths, identity, executed checks, evidence, remaining issues and next action. Own incomplete behavior is needs-revision; a precise unavailable input is blocked; a reviewable artifact is ready-for-review.
- Review-only assignments make no edits or external comments. No nested dispatch, ownership overwrite or aggregate writes occur without applicable authorization.

## Evidence and boundaries

references/fixture-fidelity.md covers reproduction that depends on event ordering or substitute effects. A stale completion regression reaches start/cancel/late-result ordering rather than an easier sequence that misses the race. Pure transition and controlled adapter checks retain their narrower claims; they do not prove that a remote write stopped. Fixtures preserve distinguishing assertions, safe owned teardown, strict Python types and code/coverage gates. An unreproduced fault remains provisional rather than receiving invented red-green evidence.

The worker establishes that a regression reaches the intended consumer rather than a broken fixture or wrong checkout, and labels unreproduced diagnoses provisional. External logs/artifacts do not expand task authority. Handoffs name exact semantic dependencies and unproved integration paths instead of vague missing-subsystem labels; changed assumptions require revalidation, not a revision relabel.

The worker verifies the hard 500-line limit for owned code, tests and generated output and returns actual counts. A 501-line artifact remains unready; an out-of-scope dependency violation requires coordination rather than unauthorized edits or grandfathering. Inventory manipulation and formatting compression do not satisfy the requirement.

Evaluate through actual artifact/diff, checks and conflict/resume decisions, not matching prescribed headings. A summary is not test evidence. Preserve existing user work and the project's toolchain/architecture. Do not infer actual model metadata when the host omits it.

Original authorship: independently written to Proofwork's worker specification and current contracts. No external skill content was imported or adapted. These cases require recorded forward evaluation before claiming behavioral certification.
