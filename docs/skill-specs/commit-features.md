# Commit message specification

## Purpose and policy

Prepare truthful commit messages under an explicitly selected target-project policy. `.proofwork.json` accepts `commitFormat: proofwork | conventional | off`. Missing file or property defaults to off. No automatic Proofwork message or push gate applies without opt-in.

The skill respects incumbent project conventions, hooks and authority. Invoking it can produce a requested draft; it does not automatically configure a gate, commit, publish, amend, rebase or force-push.

## Required decisions

- Inspect current target-project policy before choosing plugin syntax. Reject malformed configuration or unsupported values instead of silently defaulting.
- In Proofwork mode, require exactly one nonempty Major features section and one nonempty Minor features section, using None as appropriate. Scope categories do not define version bumps.
- In Conventional mode, validate the typed subject, optional scope/breaking marker, nonempty description and blank body separator. Syntax checking does not certify complete footer conformance, semantic type choice, compatibility or release policy.
- In off mode, impose no plugin formatting or pre-push message enforcement. Existing project rules remain applicable.
- Describe this actual committed artifact and executed evidence. Preserve unrelated work, truthful staged/committed provenance and public compatibility.
- For authorized delivery with an enabled format, establish the actual newly outgoing range against observed remote state and check the selected commits. Disclose unavailable remote inspection or malformed history.
- Never repair messages automatically, including unpublished commits. Actual history rewriting requires explicit authority and preservation of other owners, content, hooks and signing.
- Keep per-destination acceptance and uncertain transport outcomes separate; retry only after reconciliation within authority.

## Interfaces and disclosure

`checkMessage(message)` retains the existing pure Proofwork-format validation default for callers. An explicit second argument selects `proofwork`, `conventional` or `off`; this helper does not read a repository or enforce delivery.

`configuredCommitFormat(repo)` resolves the Git root where available and reads its `.proofwork.json`. Non-Git targets use their own local configuration. `checkRange(repo, range)` reads policy and returns the existing per-commit array; off returns no inspected commits. An explicit helper argument can select a format for a deliberately requested local check.

The CLI retains `--repo PATH --range GIT_RANGE` and reports `{format, enabled, commits}` so disabled enforcement cannot be mistaken for a verified empty range. It never writes Git history. No hook installation or CLI format override is provided.

## Acceptance cases

1. An unconfigured repository with a free-form commit passes without message inspection or history mutation.
2. Explicit off likewise skips enforcement and reports disabled in CLI output.
3. Explicit Proofwork rejects missing, duplicate or empty sections; concrete content and None pass.
4. Explicit Conventional accepts scoped, unscoped and breaking-marker typed subjects without Proofwork sections; malformed subjects or missing body separators fail.
5. Invalid configuration and unsupported values fail closed. An unrelated valid project configuration with no commitFormat defaults to off.
6. A nested Git working directory uses the project's root policy rather than ignoring it.
7. A multi-commit range checks each selected commit only when enabled. Unsafe option-like ranges are rejected in every mode.
8. Message validation or a format failure never changes commit identities or automatically rewrites published, shared or unpublished history.
9. Partial staging, content-changing hooks and generated inputs preserve meaningful validation provenance.
10. Multi-ref delivery and interrupted transport require separately observed outcomes; formatting cannot create publication authority.

## Evidence and authorship

Originally authored for project-selected message assistance and validation. Runtime fixtures exercise format selection, syntax and read-only Git boundaries. They do not establish the instructional workflow's remote decisions, semantic truth or release correctness.
