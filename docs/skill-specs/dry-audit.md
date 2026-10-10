# DRY-audit specification

Audit duplicated knowledge and give genuinely shared rules one appropriate owner. Similar syntax alone, line-count thresholds or a findings quota cannot justify consolidation. Preserve distinct policy, resource lifecycle, boundary enforcement and public compatibility. Originally authored guidance.

## Required decisions and acceptance cases

- Trace inputs, consumers, invariant, owner and change reason before sharing. Two identical-looking calculations with different rounding contracts stay separate.
- Reuse a current owner or introduce a narrow pure domain function; migrate consumers and remove obsolete copies. Flag-heavy helpers, generic engines and unowned mutable singletons fail.
- Client/server validation retains both enforcement points; a shared schema does not replace server authorization or current-state checks.
- Shared domain tests and distinct consumer/seam checks retain unique failure detectors. Production computation must not become its own expected-value oracle.
- Generated copies are changed through their source. Runtime, error, precision, cancellation and ownership behavior survive extraction.
- Follow language, separate 95% coverage and 500-line gates. Report supported retained differences and unavailable checks; no unmeasured performance claims.

Routing and package checks establish discoverability, not target-project equivalence or improved maintainability. Each repair needs its own consumer evidence on the final artifact.
