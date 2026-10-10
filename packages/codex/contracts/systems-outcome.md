# Systems outcome

Every full-tier and Harden-and-Finish delivery produces one short Markdown artifact. Default local path: `.engineering-team/runs/<run-id>/systems-outcome.md`; use `.engineering-team/systems-outcome.md` when no run exists. Link it in the final report. Do not initialize a ledger for an otherwise standard finishing task. Share only a deliberately sanitized copy.

This is a handoff, not certification. Produce it for incomplete work too. Keep unavailable observations pending, distinguish recommendations from implemented/exercised controls, and use justified not-applicable entries instead of inventing operations requirements. Reuse the release record; do not create a second findings ledger. Tiny light tasks retain a short final report.

## Outcome and identity

Requested outcome; reached state (incomplete, locally verified, ready for staging, ready for production, deployed, verified live); source/delivery artifact identity, relevant lock/configuration revision and observation environment. State each readiness decision independently. A completed scoped audit need not mean production-ready.

## Verified on the artifact

Criterion | actual command or interaction | artifact/evidence pointer | observed result | scope/gap.

Record failures as well as passes. Identify manual claims and interrupted checks. Evidence must still match relevant inputs; a build alone does not prove the user journey. Provide re-runnable checks without private paths, accounts or secrets.

## Failure and recovery

Consequential failure | affected users/data/systems and containment | stop trigger | recovery steps | owner | rehearsal evidence or gap.

Tie steps to current mechanisms and safe state. Mark irreversible changes, unknown external effects, backup/restore limits and required authority. Inspection is not a completed recovery drill.

## Inputs and drift

Dependency/lock/build-artifact relationship; configuration parity and intended differences; unresolved drift, supply-chain issues and migration compatibility. State inspected scope, not universal absence. Link existing records instead of duplicating tables.

## Observability

Signal | purpose and threshold/window rationale | log/metric/alert location | operator response | evidence state.

Distinguish recommended, implemented, emitted, collected, queryable and notification delivered. Use existing tooling and protect secrets and sensitive identifiers. Unavailable monitoring stays explicit.

## Residual risks and operator ownership

Risk/gap | consequence | mitigation/next check | owner or unassigned | blocking gate | acceptance authority.

List remaining hosting, credentials, deployment, monitoring and recovery actions. The agent cannot accept material risk on behalf of an operator. Unknown owners remain unassigned. Close with the next useful action, not an unsupported readiness claim.
