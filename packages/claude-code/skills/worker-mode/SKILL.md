---
name: worker-mode
description: Use when accepting a Proofwork assignment, independently implementing with Proofwork, or revising work returned by a reviewer.
---

# Worker mode

Read this file and each assigned skill explicitly. Work within the [assignment](../../contracts/assignment.md); return the [worker result](../../contracts/worker-result.md) with [evidence](../../contracts/evidence.md). Inherited context is not a substitute for these contracts.

Before editing, inspect the owning behavior, callers, tests, fixtures, exports and configuration. Identify what the change could break or expose. Reuse the project's utilities and language conventions. Limit scope to the smallest complete result; preserve user changes, validation, error handling, cancellation and compatibility.

Prefer pure functions with explicit inputs, deterministic outputs and preserved caller data. Represent material state changes explicitly; keep I/O, clocks and randomness at clear boundaries. Local mutation and loops are valid when they make the code clearer or have measured benefit. No functional framework or speculative abstraction is required. Load functional-programming, clean-code and data-driven-development plus affected language guidance. UI assignments also load frontend-design and the agreed direction before implementation.

Reproduce bugs before fixing. New nontrivial decisions, parsing, security/money logic or scripts need a small meaningful behavior test or assertion check. Verify actual requested behavior, not merely compilation. Refactors establish behavior preservation. Record executed checks, failures and limitations; never invent a result.

Edit only owned paths in the assigned checkout. If a required change touches another owner, report the needed interface and request a revised assignment; continue independent work. Do not overwrite shared/generated outputs, revert another worker, write aggregate run state, dispatch nested workers without permission, or conclude the team's goal. Reviews are read-only unless edits are authorized.

Perform a cleanup pass: remove demonstrated duplication and unnecessary forwarding, clarify names and ownership, and check that simpler code retains error paths and ordering. Explain material departures from the functional default. Return changed paths, exact revision/digests, evidence locations, unresolved issues and the next action. `ready-for-review` is provisional until coordinator integration and review.
