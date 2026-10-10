# Comparative evaluation

Eight dependency-free tasks cover a correctness bug, feature, refactor, path
hardening, interface control, retry policy, data semantics and partial-update
contract. Each starts with a failing public test. The same task and original
tests are used for every arm: `bare`, caller-supplied `reference`, and `proofwork`.
The default is three repetitions per task and arm; a complete run has 72 rows.
Each also has an independent regression check that passes before changes. The
harness verifies those baseline conditions before invoking any runner.

The runner must be configured locally. It executes with the user's authority,
without a shell. Review its command, model, account, configuration and sandbox
before starting. Do not supply credentials, live application access or permission
to change host settings. The harness does not certify the runner's isolation.
Reference instructions stay local; no external instructional content is bundled.

Create an ignored JSON config with `command`, string-array `args`, optional
`stdinPrompt: true`, and `timeoutMs`. Arguments can contain `{workspace}`,
`{promptFile}`, `{replyFile}` and `{metadataFile}`. The runner receives only its
workspace and task context. The reference arm requires `referenceContextPath`;
Proofwork defaults to canonical skill entries and can use `proofworkSkillRoot`.
Bare receives the task and shared evaluation constraints without a skill profile.
The entry, selected skills/principles and preparation/options guidance are injected; deferred review/report
selection is included as a phase plan, to load when reached. conditional references remain at
their declared source paths. An installed automatic plugin can contaminate the
bare arm, so host isolation must be verified separately.

Run a bounded pilot before spending on a full comparison:

```powershell
node evals/ab/run.mjs --config .engineering-team/ab-runner.json --tasks last-page --arms bare,proofwork --runs 1
```

Then select all eight tasks, all three arms and three runs. Missing reference
context is an error, not permission to silently omit that arm. A runner failure
stops the comparison after preserving its observed row; opt into
`continueOnRunnerFailure` only for an intentional failure experiment.

Public tests are copied into a fresh disposable workspace. Acceptance and regression
tests are withheld from that workspace. After the runner exits, an independent
verification directory receives candidate sources and the original public,
acceptance and regression tests. Editing workspace tests cannot change those checks. This is logical
withholding, not an operating-system security boundary: a hostile same-account
agent could inspect files outside its workspace. Treat the runner as cooperative
and record any suspected oracle access or contamination as an invalid run.

Local results and raw output default to ignored `.engineering-team/ab/`.
Rows record runner exit, observed acceptance, original-test outcome, introduced
regressions, wall time,
changed file paths, fixture identity and evidence directory. The optional metadata
file accepts `tokens: {input, output}`, `claims: {acceptancePassed: boolean}`,
`requestedModelId`, `actualModelId`, optional per-role `modelRoles`, and finite
nonnegative `costUsd`. Model IDs, token counts and cost are runner-reported, not
independent provider receipts; invalid or missing observations remain `null`.
Per-role records have `role`, `requested: {model, reasoning}` and
`observed: {model, reasoning}`; unavailable observations stay null. The normalizer
adds `source: "runner-reported"` to roles and `costSource` to valid cost.
A still-failing
original test is unresolved work, not an introduced regression. Regression counts
record newly failed baseline-passing contract checks. Acceptance claims
can be compared with actual acceptance, but broader narrative claims require
human review and remain pending. A passing command does not establish good design,
security completeness, visual quality or effectiveness on production projects.

Import `summarize(rows)` from `run.mjs` for an arm comparison of successes, introduced
regressions, median time, total reported tokens and files changed. Export only
a reviewed sanitized aggregate to public documentation; never publish prompts,
reference context, raw model output or arbitrary candidate files. Unequal task
sets, interrupted arms, missing metrics and unavailable hosts must remain visible.

## Compare single-model and configured roles

Use the same Proofwork source revision and task set in both conditions: one model
for every role versus the reviewed model-role configuration. Comparing `bare`
with `proofwork` changes instructions as well as execution and cannot isolate
the contribution of model routing. The current harness accepts `bare`,
`reference` and `proofwork`; model-role conditions can use separate runner
configs and output directories while both select the `proofwork` arm.

```powershell
node evals/ab/run.mjs --config .engineering-team/single-runner.json --tasks last-page --arms proofwork --runs 1 --out .engineering-team/ab-single-pilot
node evals/ab/run.mjs --config .engineering-team/roles-runner.json --tasks last-page --arms proofwork --runs 1 --out .engineering-team/ab-roles-pilot
```

The second command does not itself dispatch multiple models: its locally reviewed
runner must consume the configured roles and the host must support their actual
execution. Configs may include `modelPlanPath`, a saved read-only planner result
injected only into the Proofwork condition. It must have five resolved roles,
empty `capabilityMissing`, bounded budgets and `dispatchUnverified: true`; an
unresolved plan is rejected. Use an all-inherit plan for single-model and the
configured plan for roles, keeping all other skill/principle instructions fixed.
The injected plan is requested data, not evidence of dispatch or enforced budgets.
Record requested and observed model/reasoning identities and cost in runner
metadata, with fallbacks and budget observations beside each row. Do not label
single-model role separation as cross-model.

After a usable paired pilot, repeat both conditions on the same eight tasks at
least three times, alternating which condition starts each pair. The harness has
no seed or randomization option; record provider sampling settings/seed when
exposed and otherwise mark them unavailable. Use fresh workspaces and reviewed
isolated host configurations. Keep private tests away from agents and compare
anonymized artifacts with independent graders after execution.

Follow the [model-role evaluation protocol](../../docs/model-role-evaluation.md)
for metrics, scenario extensions and reporting. Runner wall time is measured,
but first independently verified-slice time, monetary cost and actual model
identity require additional observations. Missing values stay unknown.
No usable completed model-role comparison has been published; the previous
[Codex pilot](../results/improvement-evaluation.md) was execution-blocked and
the [Claude turn](../results/native-claude-turn-20261010.json) ended at
authentication before a model response.

The Proofwork arm also injects the selected named playbook guide; context-budget counts that initial input. Deferred review/report and conditional reference costs remain separate.

The staged arm includes the selected procedure guide and required recovery references for Resume Work. It records continuation metadata and deferred review/report entries. This matches the context-budget accounting; conditional references beyond required recovery remain additional. Structural input parity is not evidence of agent adherence or comparative quality.
