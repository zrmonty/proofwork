# Language and principles behavioral evaluation

Status: scenarios specified before skill authoring on 2026-10-10. A coordinator-run broad fresh Codex baseline is recorded at results/baseline.txt; it already handled pure inputs, Python defaults, and Rust input errors. The full cases below and guided runs remain unexecuted. Packaging checks do not change that status.

Run each prompt in a disposable project, first without Proofwork and then in a fresh context with the selected skills. Keep project, input, tool access, and acceptance criteria identical. Save actual code, commands, outputs, revision/digests, review findings, interventions, and unavailable checks. An evaluator scores observable behavior, not whether the response repeats guidance. Multiple runs are required for comparative claims.

| Case | Prompt / fixture | Acceptance rubric |
| --- | --- | --- |
| TS-boundary | Parse unknown JSON as queued/running/succeeded/failed jobs. Reject malformed jobs. Existing tsconfig and tests must stay in place. | Runtime validation covers required variant fields; transition handling is exhaustive; no assertion substitutes for validation; unknown state fails explicitly; actual project checks run. |
| Rust-summary | Summarize borrowed ledger entries; reject overflow and invalid amounts without panicking. Caller still uses entries afterward. | Input remains usable; recoverable errors represented; arithmetic policy tested at bounds; no unnecessary cloning/crates; configured cargo checks run. |
| Python-alias | Implement deterministic grouping without modifying caller lists, including repeated calls and nested records. File loading must close resources on error. | No mutable defaults; aliasing is tested; typed interfaces match runtime behavior; exceptions preserve useful cause; file closure exercised; no new toolchain imposed. |
| State-effects | A delivery request can be submitted, fail, and retry. A timeout may mean the server already accepted it. | Pure decisions and effect execution are distinguishable; repeated identical inputs give identical decisions; persistence and idempotency strategy prevent duplicate delivery; cancellation/failure observed; no claim that purity makes network writes atomic. |
| Data-experiment | A proposed cache should improve a 1,000-record report. Determine whether to keep it. | Baseline and success threshold recorded before experiment; representative inputs and repeatable commands used; end-to-end result and variability compared; reject change if evidence fails threshold; do not invent timings. |
| Clean-positive | Review a small explicit loop that mutates only a private accumulator and handles all errors. | Accept clear local mutation; no mandatory reducer, framework, wrapper, or abstraction; clean verdict is allowed. |
| Mixed-contract | Python emits ledger JSON consumed by TS; Rust calculates amounts. Include empty, malformed, and large-number cases. | Shared field/number/error policy established; serialization exercised across producers and consumers; boundary validation remains; language-only tests cannot stand in for contract test. |

A material criterion failure fails that case. Record unavailable execution as unverified, not a pass. Baseline gaps may guide later wording changes; document any changed rubric before rerunning.
