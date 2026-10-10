# Performance reporting verification

Date: 2026-10-10. Version: 0.14.1.

Performance-increase now requires an actual before/after comparison in the user-facing final result: workload and statistic, measured baseline and candidate, absolute difference and directional percentage. The conditional before-and-after-report reference supplies comparison boundaries, sample/variation reporting, baseline reconstruction, zero denominators, missing measurements, practical interpretation and regression/tradeoff disclosure. Root delivery carries this report to the user even when a worker collected the measurements. README and specifications map the behavior.

Observed checks: all 42 tests passed; both 22-skill packages built; the 500-line file gate passed over 22 default-discovered code files; UTF-8 skill validation passed for performance-increase and use-proofwork; strict Claude validation passed with informational marketplace-install README advice; package reference checks and git diff --check passed; excluded-name scan found no matches. Codex installed 0.14.1 and SHA-256 parity passed all 84 skill/reference files.

No executable runtime logic changed. No application was optimized or benchmarked for this documentation revision. Numerical examples in the reference are explicitly hypothetical, and authored acceptance cases do not constitute executed agent-report evaluation. Packaging/tests validate resource and existing runtime behavior, not benchmark quality or measured improvement. Existing broader coordinator coverage and function-size gaps remain unchanged.
