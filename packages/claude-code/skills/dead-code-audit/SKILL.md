---
name: dead-code-audit
description: When proving unused code and exclusively attached tests can be removed.
---

# Dead-code audit

Remove proven unreachable responsibilities and their exclusively attached tests, then verify surviving behavior. An audit-and-remove request includes scoped local deletion; honor explicit read-only review. Source cleanup does not authorize deleting user records, deployed assets, database history or external resources.

## Establish supported roots

Inspect instructions, edits, supported environments, public exports, build/package configuration, entry points, tests and generators. Record scope and content identity. Use searches, compiler/linter diagnostics and incumbent dependency tools to identify candidates, then trace their consumers from actual roots.

Include routes, commands, jobs, discovery, reflection, string lookups, initialization imports, feature flags and platform-specific configurations as relevant. Read [reachability and test ownership](references/reachability-and-tests.md) for uncertain consumers. No search matches, zero coverage or an unused diagnostic is a lead, not proof. Public exports may have external consumers; mutually referenced components may still lack a live root.

Classify candidates as proven dead, intentionally retained or unresolved, with supporting configurations and evidence. Keep uncertain code rather than guessing. A clean result is valid; impose no deletion quota.

## Remove the complete responsibility

Read [durable consumers and retirement](references/durable-consumers-and-retirement.md) for persisted versions, queued work, staged flags or old configuration. Removing a producer does not retire its durable consumers. Check actual migration, compatibility and retention contracts before deleting associated history or interfaces.

Delete proven dead implementation, imports, exports, registrations, obsolete configuration and documentation together. Preserve initialization, cleanup and errors needed by surviving paths. Change generators rather than generated output. Avoid empty wrappers, commented copies or speculative shims.

Remove a dependency only after its final production/build/test consumer disappears. Update manifests and lockfiles with the existing manager; verify the consumed build. Do not manually remove transitive entries or upgrade unrelated packages.

Map affected tests to protected behaviors. Delete exclusively obsolete assertions and exclusively owned fixtures, snapshots, mocks, helpers and test dependencies. Reshape mixed tests to retain live assertions. Keep surviving security, error, ownership, compatibility and public-behavior detectors; never delete a failing survivor to get green. Test-only utilities used by live suites are not dead. Duplicate-but-live cases belong to [test economy](../tdd-95/references/test-economy.md).

## Verify survivors

Distinguish baseline failures from regressions. Re-search removed symbols, inspect remaining registrations, run actual build/type/import checks and test discovery, and exercise the surviving public path and affected alternate configurations. A command discovering no expected tests is not a pass.

For executable cleanup, follow [tdd-95](../tdd-95/SKILL.md). Existing distinguishing tests may suffice; do not invent tests of absent helpers. Rebuild the independent source inventory after justified deletions, retain separate 95% line/branch gates and stricter existing requirements, and disclose removed paths and denominator changes. Do not hide live code to improve coverage.

Report removed responsibilities and tests, reachability evidence, preserved contracts, final-artifact checks, and retained/unresolved candidates. Missing tooling or external-consumer evidence remains a gap; a smaller repository does not prove every remaining file is live.
