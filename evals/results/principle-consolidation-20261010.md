# Principle consolidation — 0.30.0

The fifteen independently listed principle skills were removed. Their overlapping design judgments now use one
design-economy test; effort remains tier policy. Evidence and user-authority overlaps were consolidated, while
language selection and boundary implementation defer to existing owners. Seven conditional references remain.

Executed local checks:

- Full `npm run check`: source formatting, discovery uniqueness, unchanged context limits, all test/coverage gates,
  both host builds and package links passed. Runtime coverage: 2,349/2,381 lines and 1,459/1,500 branches, above 95%.
- Runtime script identity: `scripts-sha256:43fb8039fcaf4294976a725dedd0aa43a1064a22454fc09a744c6ffd22fbe174`.
- Focused final route tests passed. Both generated layouts execute explained routing, load the selected reference,
  and contain no `pw-principle-*` skill directory. Evaluation context tests verify reference injection.
- Standard and optional-hook packages rebuilt after the version update. Native Codex installer reports 0.30.0
  enabled. This confirms installation, not a live agent's adherence or lifecycle-hook execution.

| Deterministic measure | 0.29.0 | 0.30.0 |
| --- | ---: | ---: |
| Skill discovery entries | 49 | 34 |
| Discovery description words | 380 | 305 |
| Largest light-route context, words | 679 | 625 |
| Largest standard-route context, words | 2,761 | 2,791 |
| Initial context across the same 92-prompt corpus, words | 159,484 | 159,943 |
| Deferred phase context, words | 19,022 | 19,022 |

Discovery descriptions shrink 19.7%; aggregate injected guidance grows about 0.29% as references clarify ownership.
These are word counts, not provider token measurements or evidence of better engineering outcomes. Context limits
were not raised. No human or multi-model comparison was performed for this change.

Plain routing remains compatible. Explained routing now exposes principle IDs plus `principleReferences` paths;
external consumers that treated IDs as skill directories must use the new paths. The removed commands have no
discovery aliases. Prior evaluation records retain their original meanings.
