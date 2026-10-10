---
name: dead-code-audit
description: Find and remove proven dead code and its exclusively attached tests, tracing runtime roots, public contracts and shared fixtures before verifying surviving behavior.
---

# Dead-code audit

Remove code that no supported consumer or runtime path can use, along with tests that only protect that removed implementation. Complete the cleanup across imports, exports, registration, fixtures and configuration. An audit-and-remove request includes scoped local deletion; an explicitly read-only audit produces candidates and evidence instead.

## Establish roots before candidates

Read project instructions, working changes, supported environments, package/build configuration, application and CLI entry points, public exports, tests and generation mechanisms. Identify the audit scope and content identity. Preserve other people's work and legitimate compatibility requirements. Source cleanup does not authorize deleting user records, deployed assets, database history or external resources.

Use `rg`, compiler/linter diagnostics and existing dependency tools to find candidates. Trace consumers from actual roots: routes, commands, jobs, plugin discovery, dependency injection, reflection, string-based lookups, build scripts, migrations, feature flags and platform-specific entry points as relevant. Load [reachability and test ownership](references/reachability-and-tests.md) for uncertain consumers, shared fixtures and deletion boundaries.

No search matches, zero coverage and a tool's unused report are leads, not proof. A public export can have consumers outside the repository; an import can exist for initialization alone. A branch disabled in this environment can be active in another supported configuration. Cycles may keep each other referenced while the entire component is unreachable from real roots. Classify each candidate as proven dead, intentionally retained or unresolved, with the evidence and supported configurations that justify the decision.

## Delete the complete obsolete responsibility

Read [durable consumers and retirement](references/durable-consumers-and-retirement.md) when handlers depend on persisted versions, queued work, staged flags or old configuration. A removed producer does not prove its accepted durable consumers have disappeared; separate source cleanup from authorized retirement of data and public behavior.

For proven dead candidates within scope, remove the implementation and its obsolete imports, exports, registration, configuration and documentation references. Preserve initialization, cleanup and failure behavior still needed by live paths. Edit the generator for generated code rather than deleting output that will return. Do not replace removed code with empty wrappers, commented copies or speculative compatibility shims.

Check dependencies after their final real consumer disappears, including build/dev tools and scripts. Update manifests and lockfiles with the existing package manager and verify the consumed build. Do not upgrade unrelated packages or remove a transitive entry manually. Migration files, public interfaces and release artifacts need their actual retention/compatibility contract checked before removal; absence of a current source caller is insufficient.

Keep the surviving code clean and functional. Derive updated registration/data tables directly from retained behavior rather than adding a generic cleanup framework. Do not force a deletion quota or broad refactor when the correct outcome is no proven dead code.

## Remove attached tests by behavior ownership

Map each affected test to the behavior it protects. Delete tests whose only assertion is about the removed dead implementation. Remove exclusively owned fixtures, snapshots, mocks, helpers and test-only dependencies after checking all remaining consumers. If a test mixes obsolete assertions with live behavior, retain or reshape the live assertions. Keep security, error, ownership, compatibility and public-behavior regressions for surviving paths.

Tests can keep dead internals referenced without making them a production requirement. Conversely, a test-only utility used by a live suite is not dead just because production never imports it. Do not remove a failing survivor to get green or use this audit as permission to weaken a gate. Duplicate-but-live tests belong to [test economy](../tdd-95/references/test-economy.md); they are a separate decision from dead-code removal.

## Verify the surviving system

Capture relevant baseline failures before editing and distinguish pre-existing failures from regressions. Re-search deleted symbols and paths, inspect remaining references, run the real build/type/import checks and affected test discovery, then exercise the surviving public path or relevant alternate configuration. A successful test command that silently discovers no tests is not a pass. Record unavailable tooling or external consumers as gaps; retain uncertain candidates rather than guessing.

For executable cleanup, follow [tdd-95](../tdd-95/SKILL.md). Use existing distinguishing behavior tests where they already protect the change; deletion-only work does not require inventing a test of an absent helper. Rebuild the independent executable-source inventory after justified deletions, retain separate 95% line/branch gates and stronger existing requirements, and report the removed paths/denominator change. Do not exclude surviving code, narrow the agreed target opportunistically or claim coverage improved because the denominator shrank.

Report removed code and attached tests, reachability evidence, surviving guarantees, exact checks on the final artifact and retained/unresolved candidates. Claim completion only for the observed audit scope. A clean tool report or smaller repository does not prove that every remaining file is live.
