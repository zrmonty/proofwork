---
name: commit-features
description: When preparing outgoing commits under an opted-in message policy.
---

# Commit messages

Read the target repository's `.proofwork.json` before choosing a plugin format:

```json
{ "commitFormat": "off" }
```

- `off` is the default when the property or file is absent. Preserve the project's existing conventions; introduce no Proofwork message or push gate.
- `proofwork` opts into one nonempty Major features section and one nonempty Minor features section. Use None when appropriate; categories describe scope, not a version bump.
- `conventional` opts into a typed subject such as `fix(export): preserve the final page`. Describe actual compatibility changes; the bundled checker validates subject structure and the body separator, not complete semantic or footer compliance.

Unsupported values or malformed configuration are errors, not permission to silently choose another format. Explicit requests to draft a particular message remain possible with the gate off. This skill does not change configuration, register hooks, authorize publication or rewrite history.

## Describe the committed artifact

Inspect the staged diff, repository status, established vocabulary and actual verification. Explain this commit's behavior or maintenance benefit, preserving unrelated work. Do not describe unstaged changes, planned work or an untested intermediate commit as verified.

For Proofwork format, use both headings exactly once with concrete content. For Conventional format, choose a truthful type, optional scope and description; identify breaking compatibility using the project's adopted convention. With the gate off, retain the requested or established form. Read [messages and history](references/messages-and-history.md) for examples and outgoing-range decisions.

Partial staging or content-changing hooks may separate the tested tree from the committed tree. Read [content provenance](references/content-provenance.md) when that matters. Verify the supported committed artifact or limit the claim. Preserve hooks, signing, public compatibility and user's work.

## Check only an opted-in format

Before an authorized push, read current policy and identify the actual source, destination and newly outgoing range from observed remote state. With `proofwork` or `conventional`, run:

```text
node <plugin-root>/scripts/check-commits.mjs --repo <repository> --range <git-range>
```

The tool reports `{format, enabled, commits}`. Off returns `enabled: false` without inspecting messages; that is not a passing format review. The checker never edits a message or pushes. A format pass does not prove semantic truth, code correctness, remote freshness or fast-forward safety.

Do not amend, rebase or force-push automatically, including unpublished commits. Report a format conflict and offer a concrete correction within the user's authority. Actual history repair requires explicit authorization. Preserve inherited and shared history and reconcile ambiguous or partial delivery outcomes before retrying.

Return the selected policy, actual commit/range identities when checked, truthful validation and delivery outcome when authorized. Name skipped enforcement or unresolved scope honestly.
