# Performance and gated TDD verification

Date: 2026-10-10. Package version: 0.4.0.

## Delivered behavior and checks

Original performance-increase and tdd-95 skills each have two conditional references and an authoring specification. The first distinguishes application performance from benchmark wall time, requires comparable measurements and correctness, and accounts for memory and operational tradeoffs. The second requires separate target-aggregate line and branch coverage of at least 95%, preserves stricter existing requirements, and consolidates redundant test cost without discarding distinct failure detectors.

The root selects the guidance for matching tasks and records executable implementation's scoped coverage requirement in its completion criteria. Documentation-only work is exempt. The bundled check-coverage.mjs evaluates normalized real-collector counts against an independently enumerated source inventory. It rejects missing/extra/duplicate files, unavailable metrics, invalid counts, lower thresholds and below-gate ratios. It does not collect coverage or prove that an agent supplied truthful counts, a complete inventory or the actual source identity.

All 19 automated tests passed. Tests exercised real CLI failure statuses, exact ratios, stricter thresholds, absent metrics and inventory omissions. Both packages built with 16 skills; all canonical skill frontmatter checks passed; Claude strict plugin validation passed. Codex installed and enabled 0.4.0; installed new skills, root instructions and coverage checker matched the generated source hashes.

Independent review found one missed trigger: Optimize the parser omitted performance-increase. A regression assertion failed before adding optimization forms and passed after correction; the reviewer verified the corrected CLI route. No other material gate or instruction issues were reported in the reviewed scope.

## Independent forward fixture

The evaluator received the skills and a realistic request without an intended implementation. All generated work remained in an ignored isolated run directory. Environment: Windows 11, Python 3.14.5, Coverage.py 7.15.3 and Node 24.16.0. Final source identity: 4c9dc2014a4c8c4c9eb9ba0fa17395552496eb8c49f361d2567d40a197f6fe47.

The fixture filtered records using repeated membership lookups while preserving duplicates, order and caller-owned data. Before/after measurements used 8,000 records, 2,002 allowed identifiers including duplicates, 4,000 result records, five samples per implementation and three operations per sample. Output was consumed. The candidate indexed membership once per operation rather than repeating linear scans.

| Observation | Baseline | Candidate |
| --- | --- | --- |
| Operation time including output consumption, median | 38.947 ms | 0.307 ms |
| Observed sample range | 38.448–40.814 ms | 0.296–0.316 ms |
| Observed tracemalloc peak | 32,992 bytes | 164,280 bytes |

The scoped lookup improvement incurred additional peak memory. It does not establish a speedup for arbitrary inputs, types, machines, production workloads or cold startup.

The evaluator also compared rebuilding immutable benchmark input to safe reuse, with five independent command runs, eight samples and three operations per sample in each run. In-process suite median decreased from 22.562 ms to 10.441 ms. Whole-command medians were 115.313 ms and 99.563 ms with overlapping ranges, so the short-run process timing is not a robust generalized speedup claim. Product operation time and harness setup savings remain separate observations.

## Coverage and test economy

Coverage collection explicitly included the two-file executable source inventory, including a file unimported by the incomplete test suite. Final exported counters were 15/15 executable lines and 8/8 branch outcomes, passing both gates. The incomplete suite produced 11/15 lines and 6/8 branches and a nonzero gate exit. Removing the unimported file from the normalized report while retaining the independent inventory was rejected.

Consolidation reduced 12 test functions/independent cases to 11 by removing a semantic duplicate. Retained cases still covered meaningful boundaries and contract behavior. Five instrumented suite runs had medians of 212.624 ms before and 216.751 ms after, with overlapping ranges. This established less duplicated test material, not a suite-time improvement. The evaluator observed intended assertion failures before implementing zero handling, negative rejection and bulk classification, followed by green runs. An incorrect result and an exclusive rather than inclusive boundary comparator were both detected by the retained suite. The local fault harness removed only its owned source bytecode cache to prevent same-size temporary edits from reusing stale Python bytecode; correct source was restored and final coverage rerun. Local red/green and targeted fault logs are retained with the raw collector artifacts in the ignored evaluation directory.

## Limits

The numeric checks and fixture demonstrate this scoped workflow, not comprehensive assertion quality or 95% coverage of the Proofwork repository. Raw artifacts remain local; this sanitized report is published. The checks do not certify every collector/exporter, Rust branch instrumentation, a full target CI integration, production performance or comparative agent quality. Each actual project must retain its own current collector artifacts, source inventory, fault checks and integrated identity before declaring its gate or optimization complete.
