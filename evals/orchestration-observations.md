# Orchestration observations

## Baseline, October 10, 2026

The coordinator ran a fresh Codex CLI process before orchestration skill authoring. Actual output is retained in `results/baseline.txt`. A proposed nested evaluation agent could not launch because the team thread limit was reached; the fresh CLI process supplied the independent context instead.

Observed native behavior was already sound: it rejected revision A evidence after integration at B, isolated overlapping writes, kept review-only work read-only, and refused live frontend claims from old screenshots or absent tools. This is a passing baseline for those generic safeguards, not a manufactured failure.

The maintainability response measured growth from 920 to 1,060 lines and recommended responsibility-based restructuring. It did not apply a presumptive 1,000-line blocker or the three specified verdicts. It did not use Proofwork assignments, aggregate checkpoint ownership, active-mode recovery or automatic bundled routing; those did not exist yet.

Interpretation: the authored instructions encode product contracts and the specific maintainability standard. This sample does not prove those instructions outperform native behavior. Post-skill fresh-context responses and real package loading are separate verification gates owned by the coordinator.

## Scope of evidence

`orchestration-pressure.md` defines future focused cases and their rubric. The coordinator's baseline prompt exercised the same stale-evidence, overlap, review and unavailable-capability themes alongside language/frontend cases; it was not an exact execution of every case in that file. Do not count unexecuted cases as passing.

The local CLI tests can enforce state transitions and package consistency. They cannot establish that a worker really read its instructions, that a reviewer is independent, or that a rendered interface is usable. Those claims require observed host behavior.
