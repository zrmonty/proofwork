# Commit features specification

## Purpose and trigger

Prepare and check every newly authored outgoing GitHub commit with truthful Major features and Minor features sections. Classification describes outcome and scope, not semantic versioning.

## Inputs and scope

Read staged diff, repository status/conventions, actual verification, source and destination refs, observed remote state, and existing publication authority. Preserve unrelated work, inherited/shared history, hooks, signatures, and project policies.

## Required decisions

- Exactly one nonempty Major features section and one nonempty Minor features section, with None when no change belongs there.
- Classify substantial capability or architectural milestone versus focused fix/improvement/documentation/tooling from behavior, not diff size.
- Describe only this committed artifact; separate breaking compatibility and actually executed validation.
- Determine actual newly outgoing commits against the observed destination/history. Stale upstream assumptions and checking only the tip are insufficient.
- Run the bundled explicit-range checker, then examine semantic truth; format validation alone establishes neither code correctness nor authority.
- Repair messages only in locally authored unpublished history within authority. Published/shared/third-party history is not rewritten automatically.
- Disclose unverified remote range or incompatible history rather than force-pushing.

## Progressive disclosure

references/messages-and-history.md contains fictional major, fix-only, and compatibility examples plus normal-update, new-branch, empty-remote, and repair decisions. The checker remains a format-only tool and does not discover destinations or certify fast-forward status.

## Output and evidence

Return commit identities, feature summaries, observed source/destination and range, actual format/claim checks, validation gaps, and authorized push outcome when requested. Message examples must never be reported as performed tests.

## Acceptance cases

1. Documentation-only and focused bug-fix messages use Major features None and concrete Minor features entries.
2. A small diff enabling a substantial capability may be major; a large behavior-preserving cleanup is not major merely by size.
3. Missing, duplicated, or empty headings fail format validation. Both real content and None pass.
4. A breaking adapter removal is described separately without deriving a release bump from its feature category.
5. A push of multiple new commits checks all relevant messages; validating only HEAD fails the outgoing-set requirement.
6. A new branch on a nonempty remote checks newly introduced work against known remote history, not every ancestor indiscriminately.
7. A malformed shared commit is reported without automatic rewrite. Locally authored unpublished repair preserves intended content and project hooks.
8. An unavailable remote leaves the outgoing set explicitly unverified, even when the local checker succeeds.
9. Passing tests used an unstaged configuration or a hook changes staged content: validation must cover the actual committed tree or its claim is explicitly limited.
10. A worker advances the source after the range check or the destination moves: inspect the changed range, preserve normal push safety and never force-push as automatic recovery.
11. A push to several refs partially succeeds or returns an ambiguous transport result: report observed per-target identities and verify unresolved destinations before retrying or claiming completion.

## Evaluation status and authorship

Originally authored from the user's commit requirement. Existing checker tests establish format/range parsing, not the instructional workflow's remote decisions or semantic truth. Parent evaluation records actual exercised cases; no new push permission is created.
