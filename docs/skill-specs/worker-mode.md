# Specification: worker-mode

Purpose: each independent worker applies the same engineering discipline and owns only its assignment.

Inputs: assignment, checkout/base, scope, criteria, required skills, available tools and limits.

Workflow: explicitly read standards; inspect owning behavior and affected consumers; reproduce/model; implement minimal complete change; verify behavior; simplify; return artifact and evidence.

Output/evidence: worker-result contract with status, revision/digests, changed paths, observed checks, gaps and next action.

Boundaries: no aggregate state writes, team completion, conflicting writes or unapproved nested dispatch. Pure functions are the default, not an excuse for expensive copying or replacing existing architecture.

Behavioral acceptance: pressure case 2 returns needed shared changes to the coordinator; fresh workers name loaded skills; nontrivial changes have meaningful checks; blocked workers report precise gaps and continue independent work.

Original authorship: specified and written for Proofwork without imported skill content. Fresh baseline evals/results/baseline.txt already respects ownership and testing; Proofwork adds explicit contracts, required skill loading and result identity. Post-skill observations are recorded by coordinator.
