---
name: commit-features
description: Prepare truthful Major features and Minor features sections and validate newly authored outgoing commits before an authorized GitHub push.
---

# Commit features

Each newly authored outgoing commit explains its substantial and focused changes. These categories describe the commit's scope; they are independent of semantic-version rules. This skill formats and checks commits. It does not authorize a push, merge, release, history rewrite, or global hook installation.

## Describe the staged change

Inspect the staged diff, repository status, subject conventions, and actual verification evidence. Keep unrelated work out of the commit without discarding it. Name what this commit changes for a user or maintainer, not the overall project, a future feature, or work present only in the unstaged tree.

Use these headings exactly once, each with meaningful content:

```text
Major features
- A substantial capability or architectural milestone, or None.

Minor features
- A focused improvement, fix, documentation, or tooling change, or None.
```

A large diff is not necessarily a major feature. A behavior-preserving cleanup can be a minor change. A small diff can enable a substantial capability. Classify by the actual outcome; do not exaggerate to fill a section. A mixed commit can use both sections when the smaller items are distinct rather than repeating the major feature.

State breaking compatibility separately and state checks actually performed. “Tests pass” needs a real executed result applicable to the committed artifact. A documentation-only commit can have Major features `None` and a concrete Minor features entry. A fix-only commit can do the same.

Distinguish the tested working tree from the staged tree. Partial staging or unstaged fixture/configuration changes can make a passing local run inapplicable to the commit. Where this matters, verify the staged artifact in an isolated checkout or narrow the validation claim. Recheck the resulting commit when hooks modify content; do not preserve a claim that no longer describes the committed tree.

Read [messages and outgoing history](references/messages-and-history.md) for examples and push-range decisions. Use a UTF-8 message file with `git commit -F <file>` to preserve literal newlines and text. Preserve repository hooks, signing, and established commit policy.

## Validate the commits that will leave this checkout

Before an authorized push, identify the exact source revision, destination remote/ref, and newly outgoing range from observed remote state. Verify the range rather than assuming `HEAD~1..HEAD` or treating a stale tracking branch as current. A new branch is not necessarily an empty remote repository.

Run the bundled format checker:

```text
node <plugin-root>/scripts/check-commits.mjs --repo <repository> --range <git-range>
```

The checker reports malformed messages without rewriting them. Also review claims against each relevant diff; headings alone cannot prove truth or behavior. If the remote cannot be inspected, the outgoing set remains unverified. An empty range means no new commits in that comparison, not evidence that some different push target is valid.

Repair an invalid message only within authority. Locally authored, unpublished commits can be corrected without changing their intended content. Shared or published commits require explicit rewrite authorization; do not force-push to satisfy this format. Preserve inherited history, and distinguish legacy or third-party commits from newly authored work. Report any incompatible outgoing history rather than silently rewriting it.

## Return the outcome

Report commit identities, major/minor summaries, the checked range and destination, actual validation, and the push result when requested. Disclose an unverified range or blocked message. A valid commit message is neither proof that code works nor permission to send it.
