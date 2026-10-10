# Systems outcome: first-run and recovery verification

October 10, 2026 — Proofwork 0.33.0. Reached state: locally verified plugin routing/runtime/packaging. Staging and production readiness for a deployed user application: not established. Native host interruption behavior: unverified.

## Verified on the artifact

- `npm run check` passed on Node 24.16.0 / Windows, including the export fixture, checkpoint validation/recovery, routing/context gates and package builds. Runtime identity: `scripts-sha256:08de086b238fc3a13ddc16c91276a43325c6622c0fd1dc4b72ec9c7b77456637`.
- Runtime coverage: 2,408/2,440 lines (98.69%) and 1,486/1,535 branches (96.81%) across 20 independently inventoried scripts. Both 95% gates pass.
- Re-run `node --test tests/first-outcome.test.mjs`: the actual local export writes a JSON delivery file, fails the all-pages comparison with two of three pages, preserves that failure across a stopped-incomplete checkpoint, resumes the same run, and passes with all three pages after repair. Changed source invalidates earlier readiness. This is a realistic deterministic fixture, not a native-agent task-quality trial.
- Re-run `node --test tests/runtime-hardening.test.mjs`: corrupt/missing state restores only through explicit recovery; wrong backup repository and completed backup are rejected; invalid backup leaves damaged state untouched. Valid state must resume normally.
- Standard and optional-hook builds pass. Codex installation verified version 0.33.0; no lifecycle hooks, model settings or project policies were changed.

## Failure and recovery

Checkpoint corruption blocks ordinary status/mutation. Inspect the existing backup and checkout, then use `recover` with the actual run and owner. The writer lock protects restoration; damaged bytes and the valid backup remain. Restored state is stopped-incomplete and retains earlier uncertain effects plus a recovery gap. Inspect actions since the backup before clearing that gap, checkpoint the observed next action and revalidate affected checks. A missing/invalid backup remains a gap rather than starting a replacement run.

The invoice fixture has no external provider or persistent production data. Its recovery proves retained local work/evidence and an actual export comparison; it does not prove remote idempotency or disaster recovery.

## Inputs and drift

No runtime dependency was added; the CLI uses Node built-ins and existing Git/host interfaces. Package generation copies the shared systems-outcome contract into both host packages. Routing context limits remain unchanged; the 94-case corpus and all per-file budgets pass. Configuration/environment parity for an actual deployed application is outside this fixture.

## Observability

Existing command observations record exit, duration and stream digests; preflight exposes readiness reasons. Recovery adds a visible next action and outstanding reconciliation gap. These local records do not establish a monitoring backend, alert delivery or live operational coverage.

## Residual risks and operator ownership

- Native Codex/Claude event dispatch and newcomer task-quality consistency remain unverified; the next check is an isolated native task with observed edits and interruption. Owner: project maintainer.
- The systems outcome is a required instruction/handoff contract, not a new filesystem gate on every runtime completion. Model adherence needs native observation. Owner: project maintainer.
- Backup restoration cannot recover unrecorded actions, unsaved edits or external receipts. The run coordinator/operator owns reconciliation and must not treat backup validity as current evidence.
- Deployment, credential changes and acceptance of consequential production risks remain with the authorized operator. None was performed here.

[Windows and Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38087658789) passed full checks and optional-hook package parity for source commit `961a4bb`.
