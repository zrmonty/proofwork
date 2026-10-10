# Evidence Surface specification

## Purpose and trigger

Apply when explaining checks, findings or delivery status. Make the relationship between a claim and its evidence
visible without adding ceremony to a small task. This skill shapes reports; it does not run checks or grant execution
authority by itself.

## Decisions and constraints

- Identify the behavior claimed and choose evidence that actually addresses it.
- For a consequential change, connect command or manual procedure, environment, artifact, code identity, result and
  gaps. Retain unknown values rather than filling them with plausible guesses.
- Label direct observations separately from runner-reported metadata and unexecuted or manual claims.
- Read actual output, including failures, before reporting success. Explain how missing evidence limits completion.
- Include only material detail. One observed check in a sentence may be sufficient for a tiny reversible edit.
- Keep private raw output local, redact shared excerpts and preserve a useful reproduction path without secrets.
- Do not demand an aggregate ledger in light work, invent audit findings or equate a test pass with deployment proof.

## Observable acceptance cases

1. A typo fix reports its inspected change without creating a verification database or claiming a full regression run.
2. A behavior fix names the actual test and outcome alongside the relevant revision or an explicit unknown identity.
3. A manual interaction check includes the steps and environment; a source-only review never claims rendered behavior.
4. A failing test and interrupted benchmark remain visible and affect the reported completion status.
5. Token usage reported by a runner stays labeled as runner-reported rather than independently measured billing.
6. A public excerpt omits credentials while preserving the command's safe reproduction instructions.

## Verification

Trace each substantive claim to its cited artifact or stated observation. Reproduce when authorized and practical;
otherwise distinguish inspection from execution. The [worked example](../report-worked-example.md) uses placeholders
so readers cannot mistake instructional sample wording for a recorded run.
