# TDD 95 specification

## Purpose and trigger

Test-first implementation with an explicit 95% coverage floor and a smaller, faster suite where redundancy can be removed without losing fault detection. Apply to requested TDD, coverage gates and test consolidation; do not rewrite an unrelated project's test framework.

## Required decisions

- Define the selected first-party executable target before measurement; include unimported sources, retain a consistent denominator and document legitimate exclusions.
- Require at least 95% line coverage and 95% branch coverage separately, preserving stricter existing requirements. Missing required metrics are unverified rather than passing.
- Demonstrate the intended behavioral failure before implementation, then green behavior and refactoring. Distinguish infrastructure failure from a useful red result.
- Preserve independent cases and meaningful boundary, error, security, ownership and integration guarantees. Coverage percentages alone do not establish assertions are effective.
- Consolidate semantic duplicates with named independent cases and safe fixture sharing. Distinguish function count from case count and avoid chained assertions hiding later cases.
- Compare runtime under equivalent conditions, fix flaky causes and retain a failure-mode map. Use targeted fault checks when deletions could remove unique detectors.
- Establish a real nonzero CI outcome for failed tests, insufficient coverage or incomplete reports. The bundled report checker enforces normalized aggregate counts against an independently selected inventory; it does not execute tests, collect metrics or authenticate provenance.
- Report legacy gaps without silently reducing scope or thresholds; do not start unrelated rewrites. Unsupported Rust branch tooling does not justify a silent toolchain switch.

## Progressive disclosure

references/coverage-and-ci.md defines denominator integrity, independent ratios, bundled report-checker usage and provenance, CI outcomes and current collector caveats for JavaScript/TypeScript, Python and Rust. references/test-economy.md defines behavior mapping, consolidation, isolation, equivalent timing comparisons and selective fault injection.

## Acceptance cases

1. A feature starts with a failing behavior assertion, proceeds through green and refactor, and ends with both required metrics measured over the selected target.
2. A report with 98% lines and 91% branches fails the gate; a combined 95% percentage does not override the branch failure.
3. An unimported executable module absent from a report causes source-selection correction, not a completion claim.
4. A 94.96% metric displayed as 95% remains below the requirement when raw counts establish the actual ratio.
5. An existing 100% threshold remains 100%; introducing the skill does not weaken it.
6. A stable Rust project with line-only tooling reports an unverified branch gate and does not silently adopt nightly.
7. A legacy selected target at 72% remains a failing target despite a well-tested local feature; scope-appropriate progress and remaining work are explicit.
8. Repeated happy-path tests can be consolidated, but boundary, partial-failure and authorization cases survive even when their coverage contribution is zero.
9. Parameterized variants remain independently named and reported; fewer functions are not claimed as fewer executed cases.
10. A proposed shared fixture that leaks mutable state is rejected or repaired; no retries or deletion hide its failure.
11. A source fault that the old unique detector caught must still fail the consolidated suite, or consolidation is repaired before completion.
12. Faster local filtered tests do not replace the final full selected-target coverage command; stale reports cannot pass CI.

## Evidence and authorship

Original Proofwork instructions and examples. Official Vitest, Coverage.py and Rust documentation was inspected for collector behavior and capability caveats. These acceptance cases specify observable decisions; they do not claim that language projects, mutation campaigns or CI deployments were executed. Evaluation evidence belongs in the parent verification record.
