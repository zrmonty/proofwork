---
name: challenge-review
description: For independent reviewers testing integrated changes against adversarial counterexamples.
---

# Challenge review

Use for substantial integrated changes whose failure consequences warrant independent scrutiny. Establish the artifact
identity, preserved contracts and release scope. Read [model patterns](../use-proofwork/references/model-patterns.md)
before delegation; supported roles and configured limits govern dispatch, not model reputation.

Reuse current independent reviewers when they cover these questions; do not start a second panel.
Start with two fresh reviewers and a bounded challenger only when justified and supported. Respect maxReviewers,
maxParallel, time and observed usage limits; declare whether the challenger consumes the reviewer allocation. If capacity
allows only two assignments, sequence or combine scopes explicitly rather than silently exceeding it.

Separate correctness, security, maintainability, operations and failure-risk questions among assignments. Supply the same
artifact and brief without the author's verdict or other reviewers' conclusions. Ask the challenger for reproducible
counterexamples, including denied access, partial effects and recovery boundaries where relevant. Use safe fixtures;
review authority does not authorize live destructive experiments.

Feed findings into the existing [audit stack](../audit-stack/SKILL.md) and
[structural review](../thermo-nuclear-code-quality-review/SKILL.md) contracts instead of inventing competing gates.
Merge shared causes, retain evidence and assign dispositions. Repairs change the artifact and invalidate affected findings.

Report scoped findings, actual reproductions, current integrated checks, requested/observed roles and unresolved limits.
A verdict without observed checks remains a claim.
