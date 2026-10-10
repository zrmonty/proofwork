# Commit content provenance

Read for partial staging, content-changing hooks, generated output or delivery to several refs. Evidence concerns a specific artifact independently of its chosen message format.

## Distinguish the working tree, index and commit

A passing check may rely on unstaged configuration or a fixture the commit omits. A hook may alter staged content after verification. Inspect relevant differences before attributing evidence to the outgoing commit.

| Situation | Appropriate response |
| --- | --- |
| Relevant content is staged and hooks leave it intact | Inspect the resulting commit and connect applicable evidence to that tree. |
| Partial staging changes the tested behavior | Check an isolated supported staged/committed artifact, or describe the precise unverified claim. |
| A hook changes relevant content | Inspect the new tree and rerun affected checks. |
| Generated files are required delivery inputs | Verify generation and source/output agreement; preserve generator ownership. |
| Unrelated user work remains unstaged | Preserve it and keep it out of the commit without resetting or discarding it. |

Do not automatically checkout, reset or stash work to manufacture a clean verification surface. Isolation follows actual ownership and permissions. It must not silently import omitted local files.

A strict Python check that needs an unstaged stub does not verify the committed implementation without that dependency contract. Include an authorized required input, use the real installed types, or limit the claim. Do not hide the problem by excluding source or suppressing diagnostics.

## Bind each claim to its commit

Describe each message against its own diff. A later implementation does not turn an earlier documentation commit into a feature. State series-wide integration results as applying to the final integrated tree when intermediate commits were not independently exercised.

When `commitFormat` is Proofwork, keep both sections meaningful and nonempty; use None where appropriate. When Conventional is selected, match the type and description to the actual change and describe breaking compatibility under the adopted policy. With off selected, impose no plugin formatting. Truthful evidence and existing project obligations remain relevant in every mode.

The format checker reads syntax only. It does not establish whether tests ran, which tree they exercised, whether a release breaks consumers, or whether a push is authorized. A disabled result is explicitly not evidence of conformance.

## Reconcile each destination

Record the observed source and each actual destination ref. Check an opted-in format over the real newly outgoing set before authorized delivery, then inspect outcomes per target.

The [Git push documentation](https://git-scm.com/docs/git-push) describes per-ref status and optional atomic updates. Do not assume several destinations update together or add atomic mode without checking server support and the delivery contract. An interrupted transport may follow an accepted update; inspect remote identities before repeating it.

If one ref accepts an update and another fails, report those outcomes separately. Remote advancement calls for inspection and integration, never automatic force-pushing. Do not change history, global hooks, signing or credentials merely to simplify delivery.

Completion identifies the delivered revisions and unresolved destinations. A fictional message, a checker pass or a planned push is not evidence of publication.
