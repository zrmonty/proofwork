# Skill depth verification — October 10, 2026

Release: `0.2.0`. Scope: revise all twelve original skills and their specifications, add nineteen conditional references, and strengthen four shared contracts. Runtime tools and their interfaces are unchanged. The [authoring and evaluation standard](../../docs/skill-depth-review.md) was recorded before forward evaluation.

## What changed

The entry files now explain the decisions each skill owns. Linked references contain original worked examples and focused procedures instead of repeating a general checklist in every entry. Orchestration covers proportional delegation, shared contracts, integrated content identity, model-role choices and interruption recovery. Language guidance addresses validation, ownership, errors, resource lifetime, numeric boundaries and targeted checks. Design guidance derives hierarchy from content and tasks, with coherent typography/spacing/shape, meaningful iteration and truthful visual-evidence limits. Functional, empirical, cleanup and commit guidance make their tradeoffs and failure conditions concrete.

Examples include a TypeScript decoder and exhaustive state handling, a borrowed Rust ledger with checked totals, Python nested ownership and loader error handling, an immutable invoice update, uncertain delivery transitions, review findings with preservation checks, and different frontend compositions for different product shapes. They are independently authored for Proofwork's requirements; no existing skill text was imported or adapted.

## Structural and package checks

- All twelve entries passed the skill-creator frontmatter validator in Python UTF-8 mode.
- Both packages build with twelve skills and nineteen reference documents each. Package-local Markdown links resolve.
- All fourteen existing automated tests pass. No runtime behavior change is claimed from instruction edits.
- Claude's strict package validation passed. An informational README install-line suggestion did not affect its verdict.
- Independent review read all twelve entries, nineteen references, shared contracts/principles, adapters and actual tool semantics. No material finding was demonstrated; maintainability verdict: **meets the bar**.
- Current source/package scans found no excluded project references or unfinished scaffolds. Git whitespace checks pass.

## Executed examples

The language author extracted Markdown code blocks into an isolated temporary workspace:

- TypeScript `5.9.3`: strict/noEmit compilation with ES2022 target and ESNext modules passed. Node `24.16.0` assertions passed. Adding an unhandled state produced the expected `TS2345` exhaustiveness failure.
- Rust `1.95.0`: extracted blocks compiled with `--test`; the ledger contract test passed.
- Python `3.14.5`: decoder, numeric boundaries, nested-data preservation, returned-data ownership, loader/error-cause and file-closure assertions passed.

The functional examples ran separately under Node with nine assertions for nested updates, intended structural sharing, totals and empty input. That check executes stripped TypeScript; it does not establish static type compatibility. These are example checks under the stated configurations, not full language/framework certification.

## Fresh forward-use cases

Two fresh agents received realistic requests, the built skills and only the necessary fixture/context. They did not receive the intended answers or source-review rubric.

**Python implementation:** A standard-library event queue groups validated records while preserving order and independently editable nested data. The agent loaded the Python, functional and cleanup guidance and relevant references, implemented only the isolated fixture, and ran unchanged acceptance tests on bundled Python `3.12.14`. All six passed, including boolean/integer boundaries, caller preservation, independent calls and file closure on malformed JSON. Supplemental assertions covered field boundaries, delivered-record validation, one-shot iteration, nested independence, UTF-8 and JSON-list shape. The coordinator inspected the implementation and observations. The initial missing-module failure reflects an unimplemented fixture, not a demonstrated baseline defect or incremental skill benefit.

**Coordinator reasoning:** Given stale export evidence, changed serialization, unknown worker liveness, an uncertain timed-out upload and limited budget, the agent rejected completion. It proposed concrete liveness/content/effect reconciliation, affected verification and an actionable stopped-incomplete checkpoint. This was scenario reasoning; no goal, checkpoint or remote effect was changed.

**Positive review:** The agent reviewed a direct private-accumulator loop under its supplied contract, ran focused Node assertions, and found no concrete issue. It gave exactly one maintainability verdict, **meets the bar**, without demanding a reducer or framework.

**Editorial direction:** The agent compared two materially different compositions for supplied publication content, selected a prominent lead with an open essay index, preserved the incumbent identity and gave responsive, interaction and iteration criteria. It explicitly left rendered/interaction acceptance unproved because browser tools were unavailable in the assignment. Planning quality is not evidence of a completed visual implementation.

Raw responses, fixture code, command outputs and review identities remain local under `.engineering-team/runs/skill-depth-20261010/`. This report exports scoped observations rather than provider transcripts.

## Limits

These cases establish behavior in the tested scenarios. No repeated paired benchmark, general quality multiplier, fresh-host native goal continuation, rendered frontend task, async/unsafe integration, older-toolchain matrix or authenticated Claude workflow was run. Those gaps remain explicit; expanded prose and passing package checks do not settle them.
