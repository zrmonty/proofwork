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
The entry and selected skills are injected; conditional references remain at
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
file accepts `tokens: {input, output}` and
`claims: {acceptancePassed: boolean}`. Missing or invalid counts remain `null`;
reported token counts are not an independent provider receipt. A still-failing
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
