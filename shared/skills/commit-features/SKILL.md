---
name: commit-features
description: Use when preparing commits or sending newly authored commits to GitHub in a Proofwork run.
---

# Commit features

Make each outgoing commit explain its actual major and minor changes. This skill formats and checks commits; it does not authorize pushing, merging, or publishing.

## Inputs

Read the staged diff, repository commit conventions, completed task evidence, and authorized destination. Before a push, identify the outgoing commit range from the actual remote state. Do not stage unrelated files or rewrite existing history to impose this format.

## Procedure

1. Inspect `git diff --cached` and the changed behavior. Use the project's subject convention, followed by the sections below.
2. Put substantial capabilities or architectural milestones under Major features. Put focused improvements, bug fixes, documentation, or tooling under Minor features. Use `None` for an empty category. Describe exactly this commit, not future work or the whole project.
3. State verification actually performed and relevant gaps. Identify breaking compatibility separately; feature size does not automatically select a semantic-version bump.
4. Write the message to a UTF-8 file and use `git commit -F <file>` to preserve literal text and newlines. Check the resulting message. Before an authorized push, check each new outgoing commit for both feature sections and check its claims against the diff. Stop to repair messages in locally authored, unpublished commits if needed; do not rewrite shared commits without authorization.

```text
feat: add export recovery

Major features
- Recover interrupted exports from a validated checkpoint.

Minor features
- Explain an invalid checkpoint in the error view.

Validation
- Regression test passes for interrupted export recovery.
- Browser verification was not available.
```

For a documentation-only commit, Major features may be `None`; Minor features names the documentation change. Never fabricate a feature just to fill a section.

## Result and boundaries

Return the commit identity, feature summary, verification gaps, and authorized push result when requested. A valid message is not evidence that code works. Use the actual host's Git tools; preserve signatures, hooks, and project policies. For deterministic checks use `node <plugin-root>/scripts/check-commits.mjs --repo <repository> --range <git-range>`; this checks format only, and reports malformed commits without rewriting them.
