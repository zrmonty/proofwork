# Dead-code-audit specification

## Durable-consumer decisions

Load references/durable-consumers-and-retirement.md for persisted versions, queued jobs, old configuration or staged flags. Treat supported stored identifiers and retained upgrade/restore paths as potential callers. Establish retirement authority and observation bounds without exposing private records or mutating live data.

Acceptance: an obsolete enqueue producer can be deleted while its old job handler and distinctive compatibility tests remain for accepted work. Authorized retirement with adequate evidence permits complete handler/registration/exclusively owned test removal. A locally disabled feature or skipped compatibility test is not automatically dead. Rebuild surviving source inventory and preserve gates without claiming percentage increases prove stronger tests.

## Purpose and scope

Remove proven unreachable/obsolete code and exclusively attached tests as a complete scoped cleanup. Explicit read-only requests remain read-only. Preserve live behavior, external compatibility, user data and other owners' changes. Guidance is independently authored; no external skill assets are imported.

## Required decisions

- Establish supported roots/configurations and snapshot before classifying candidates. Search, coverage and unused diagnostics alone are insufficient.
- Check dynamic discovery, side effects, public consumers, generated bindings, migrations and alternate platform/flag paths.
- Remove complete obsolete responsibilities and dangling registration/import/export/config/docs references. Change generators and use existing package-manager lock maintenance.
- Map tests to behavior; remove tests and fixtures only when exclusively attached to deleted code. Independently update source inventory with explained deletions; no surviving-source exclusions or gate relaxation.
- Verify final discovery, build and surviving behavior. Give supported clean verdicts without quotas, false exhaustive claims or unmeasured performance savings.

## Acceptance cases

1. Internal helper only referenced by its private test: after root/export/dynamic checks, delete helper and attached test and clean imports. A tests-only edge alone is not a production root.
2. Plugin discovered by glob with no direct import: retain it or establish retirement from the actual discovery contract; a textual search-based deletion fails.
3. Public export or applied migration has no internal caller: retain pending supported compatibility/retention evidence; unauthorized retirement fails.
4. Two dead modules reference each other: identify no path from supported roots and remove the component coherently rather than preserving a reference cycle as proof of life.
5. Mixed live/obsolete test and shared fixture: remove obsolete assertions, retain live behavior and shared consumers. Blanket test-file deletion fails.
6. Baseline failure or undiscovered test: preserve/diagnose the live requirement rather than deleting it for green.
7. Coverage denominator shrinks: record justified source removal, reconstruct independent inventory, preserve gates and reject claims of improved test quality from percentage alone.

## Evidence limits

Routing, build and reference validation establish package structure. A target repository needs its own reachability analysis, deletion diff and final behavioral checks. No exhaustive dead-code, compatibility or performance claim follows from structural validation.
