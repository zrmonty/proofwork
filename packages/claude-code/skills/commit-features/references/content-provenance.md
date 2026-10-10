# Commit content provenance

Read for partial staging, hooks that alter files, generated output or delivery to several refs. Verification applies to content, while Git messages and remote updates describe specific identities.

## Identify three potentially different artifacts

The working tree, index and committed tree can differ. A passing test run may rely on an unstaged configuration or fixture that the commit omits. A hook may rewrite staged content after the last check. Inspect these differences before assigning a validation claim to the outgoing commit.

Choose a proportionate response:

| Situation | Useful action |
| --- | --- |
| All relevant content is staged and unchanged by hooks | Inspect the resulting commit and connect the existing evidence to its actual content. |
| Partial staging changes behavior | Exercise the staged/committed artifact in an isolated checkout where available, or disclose the exact unproved claim. |
| Hook changes relevant files | Inspect the resulting tree and rerun affected checks before claiming they passed for that commit. |
| Generated files are required delivery inputs | Verify generation and source/output consistency; do not manually repair output owned by a generator. |
| Unrelated unstaged user work exists | Preserve it and exclude it from the commit without resetting or discarding it. |

Do not run a checkout/reset or stash as an automatic way to create a clean test surface. Those operations can disturb active owners or user's work. Isolation must follow current ownership and permissions, and does not silently import omitted local files.

## Example: a false validation claim

A strict Python check passes because an unstaged stub supplies a missing dependency contract. The index contains only the implementation. The commit message cannot truthfully say that its strict check passed unless the committed artifact has that contract or the check is rerun on a supported equivalent environment.

The repair may be to include the authorized required stub, use the correct existing package types or remove reliance on an uncommitted fixture. It is not to exclude the affected source, add blanket suppressions or erase the failed observation. Preserve separate 95% line/branch requirements and the 500-line code gate when those apply to delivery.

## Bind claims to each outgoing commit

Review each message against its own diff. A later commit implementing a feature does not make an earlier documentation commit a major feature. A series-wide integration result can be stated as applying to the final integrated tree, rather than implying every intermediate tree independently passed.

Keep Major features and Minor features concrete and nonempty, with None where appropriate. Describe compatibility separately. Distinguish observed checks from planned checks, retained upstream evidence and checks that cannot run in this environment. Message formatting validation does not inspect any of those claims.

## Reconcile each destination

Record the observed source and each actual destination ref. A push can target more than the configured upstream. Validate newly outgoing authored history against observed remote state before the authorized operation, then inspect its result per destination.

The [Git push documentation](https://git-scm.com/docs/git-push) describes per-ref status and the optional atomic mode. Do not assume several updates are all-or-nothing, or introduce an atomic option without confirming server support and the requested delivery contract. A transport interruption can leave an accepted update; inspect remote identities before retrying.

If one target succeeds and another fails, report the separate outcomes and preserve normal push safety. Remote advancement calls for inspection and integration; it does not authorize force-pushing. Do not change published history, global hooks, signing or credentials merely to make delivery easier.

Completion names the actually delivered identities and unresolved targets. An example message, format-only checker pass or planned push is not evidence of publication.
