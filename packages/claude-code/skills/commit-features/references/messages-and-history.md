# Message choices and outgoing history

Read when selecting an opted-in format or establishing what an authorized push will send. Examples are fictional drafts, not executed changes or tests.

## Select policy before syntax

The target repository controls the plugin gate through `.proofwork.json`:

```json
{ "commitFormat": "proofwork" }
```

Allowed values are `proofwork`, `conventional` and `off`. Missing policy means off. A selected format does not authorize commits or pushes, and off does not disable existing repository hooks or independent project requirements. Do not edit configuration merely to obtain a passing check.

With Proofwork selected, a focused fix could read:

```text
Fix the last page omission

Major features
- None.

Minor features
- Preserve the final page when assembling an export.

Validation
- Single-page and multi-page regression checks passed on the committed artifact.
- Browser behavior was not exercised.
```

A small change can enable a substantial capability; a large behavior-preserving cleanup can be minor. Use the actual outcome, and do not repeat one change in both sections. Describe breaking compatibility separately without deriving a release bump from these categories.

With Conventional selected, a focused fix could read:

```text
fix(export): preserve the final page

Keep the original page order when assembling the output.
```

The [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) defines the optional scope and breaking marker. Type and scope casing are not intrinsically restricted by that specification. Our checker accepts typed subjects with optional scope and `!`, a nonempty description and a blank separator before a body. It does not determine whether a type describes the diff, infer breaking behavior, validate every footer, or choose a release.

With off selected, an ordinary subject such as `Preserve the final exported page` remains acceptable to the plugin. Preserve the project's existing form or the user's requested draft; do not append mandatory sections.

## Establish the outgoing set

Inspect the configured destination and observed remote refs. A branch's upstream can differ from its push target. For a known branch, compare the observed destination tip with the actual source tip and check normal fast-forward safety.

A new branch on a nonempty remote does not make every inherited commit newly authored. Establish its known base and relevant remote history. For an empty remote, an explicit source revision can select reachable initial history. Multiple destinations need separate observed ranges and outcomes.

When a format is enabled, validate all newly outgoing commits selected by the explicit range; checking only the tip can miss an earlier incompatible message. With the gate off, skip this plugin's format enforcement. Remote inspection and normal push safety still apply to an authorized delivery.

The checker does not discover push targets, identify authorship, refresh remotes or certify a fast-forward. An unavailable remote leaves the outgoing set unverified. An empty checked range proves only that comparison has no commits; a disabled result proves no format was enforced.

Freeze the source identity after checks. If it advances or the destination moves, inspect the changed set and re-evaluate. A rejected push does not create force-push permission.

## Preserve history

Never rewrite messages automatically to satisfy either format. Report the offending commit and a proposed correction. Explicitly authorized unpublished-history repair must preserve intended content, active owners, hooks and signing policy. Shared or published history also requires explicit rewrite authority. A new valid message cannot repair old history retroactively.
