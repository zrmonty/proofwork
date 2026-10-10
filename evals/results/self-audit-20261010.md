# Installed Codex self-audit — October 10, 2026

Scope: install Proofwork, use its root on its own repository, fix reproduced defects, obtain independent review and verify the local lifecycle. Base: `6c6b977`. Release: `0.1.1`.

## Installation and fresh execution

Codex CLI `0.150.1` successfully registered the trusted checkout with `codex plugin marketplace add` and installed `proofwork@proofwork-local` with `codex plugin add`. The listing reported installed and enabled. After rebuilding, installation reported version `0.1.1`. Metadata alone had not registered the marketplace; documentation now gives the actual commands.

A fresh ephemeral Codex CLI process invoked `$use-proofwork`, discovered the installed `0.1.1/skills/use-proofwork/SKILL.md` from its provided catalog, read its runtime/tool references and manifest, and read all selected core skills. The installed router returned bug-fix plus worker-mode, functional-programming, data-driven-development and clean-code. Shell execution succeeded on Node `v24.16.0`.

The configured `gpt-6.1-sol` was rejected by this CLI account. The user authorized `gpt-5.6-sol` for bounded verification invocations; defaults were unchanged. The probe used `-a never -s danger-full-access` with a read-only assignment in the trusted checkout. This establishes fresh CLI discovery, not a refreshed desktop menu or bare slash alias. An older concurrent probe observed replacement of its cached version mid-run; the final probe started after reinstall and observed the fixed version.

## Defects and fixes

1. A reviewed task could reopen while another active task owned its paths. Non-reviewed result transitions now share the assignment overlap guard.
2. A copied checkpoint could mutate in a different repository despite its recorded identity. Mutations now validate resolved repository identity. Read-only status remains diagnostic; a moved checkout starts a new run.
3. Builds silently tolerated missing LICENSE, NOTICE.md or UPSTREAM.md. Required legal/authorship files now fail the build when absent.

The coordinator corrected the initial review route to bug-fix because fixes were explicitly authorized. A bounded native desktop worker implemented runtime fixes and a separate read-only worker reviewed correctness and maintainability. The coordinator owned packaging, documentation, integration and aggregate state. Workers explicitly read the installed discipline/contracts; no nested delegation occurred.

## Evidence

- All 14 tests pass on Node `v24.16.0`.
- The independent reviewer ran current tests against baseline scripts in a disposable copy: exactly three new defect regressions failed, with 11 passing.
- Both packages build with 12 skills. Fixed runtime digests match generated and installed copies.
- A real subprocess CLI test covers init, assign, stop/resume, owner rejection without mutation, corrupt-current failure, inspected backup restoration, review, evidence hashes, completion and immutable completed runs. Other checks cover stale/changed evidence, locks, junctions and overlaps.
- Independent correctness review found no blockers. Maintainability verdict: **meets the bar**. The shared overlap rule preserves pure transitions and explicit effects.

Coordinator checkpoints, review artifacts and raw provider events remain local under `.engineering-team/runs/self-audit-20261010/`. The final coordinator guard is run against the integrated commit and local evidence. Its contract checks do not establish arbitrary operator honesty.

The README lists all 12 skill commands, platform spellings and local tooling. Design documents now use project-owned paths; requested external project references were removed from current files without rewriting Git history.

## Limits

No native goal was requested for this audit, so goal creation/automatic continuation was not exercised. Desktop menu refresh/bare slash registration, Rust/Python projects, frontend browser tasks, authenticated Claude workflow execution, mixed-provider routing and forced termination at every write stage remain unverified. These CLI observations supersede earlier discovery/sandbox gaps only for the tested configuration.
