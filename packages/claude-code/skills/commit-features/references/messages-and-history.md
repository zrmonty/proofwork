# Messages and outgoing history

Use this reference when classifying a change or verifying a push's outgoing set. Examples describe fictional outcomes; substitute only claims supported by the staged artifact.

## Message examples

A substantial capability with a distinct focused improvement:

```text
feat: recover interrupted exports

Major features
- Resume an interrupted export from its validated checkpoint.

Minor features
- Show the rejected checkpoint field in the recovery error.

Validation
- Interrupted-export regression passed on the staged implementation.
- Browser recovery flow was not exercised.
```

A focused fix:

```text
fix: preserve the final exported page

Major features
- None.

Minor features
- Return every page in the original order, including a single-page export.

Validation
- Export regression passed for empty, single-page, and multi-page inputs.
```

A compatibility change:

```text
refactor: remove the deprecated report adapter

Major features
- None.

Minor features
- Route internal report readers through the maintained loader.

Breaking changes
- External imports of the removed adapter need migration.

Validation
- Internal consumer integration passed.
- External consumer compatibility was not verified.
```

The last example is not permission to make that breaking change. The task must authorize it. Feature category does not select a release bump; use the project's compatibility/version policy independently.

## Determine the actual range

Inspect the configured push target and observed remote refs. Refresh or otherwise inspect remote state when authorized and available. Validate both the source revision and destination; a branch's upstream and its push destination can differ.

For a normal update to a known remote branch, a range such as `<observed-destination-tip>..<source-tip>` selects commits reachable from the source and absent from that destination. Confirm whether the update is a fast-forward. Divergence is a history decision, not a reason to force-push.

For a new branch in an existing repository, inspect the known remote history and identify commits newly introduced by the source. A comparison to the known base can be appropriate, but record that base and check whether other remote refs affect which commits are new. Do not check the entire inherited history merely because the destination branch is new.

For an empty remote repository, checking the source's reachable history may be appropriate; `HEAD` includes ancestors as well as the tip. For multiple source refs, inspect each actual outgoing set. Do not pass an invented range just to get a passing result.

The checker accepts an explicit revision/range and checks every selected commit's message. It does not discover push targets, verify remote freshness, identify authorship, certify a fast-forward, or compare claims with diffs. Those are the coordinator's responsibilities.

## Message repairs

Before correcting local history, establish which commits were authored here and remain unpublished. If another worker authored a commit, coordinate rather than rewriting their work independently. Preserve signatures and hooks under the project's policy; changing a commit changes its identity.

If published history has malformed headings, disclose it and proceed only within authorized repository policy. Never amend another person's history or use a force push as automatic format repair. A valid message on a new commit does not retroactively repair an old malformed message.
