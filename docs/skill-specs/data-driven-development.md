# Data-driven development specification

## Purpose and trigger

Clarify domain behavior through explicit data and decide measurable engineering claims from representative evidence. Separate modeling from experimentation; not every correctness fix needs a benchmark.

## Inputs and scope

Read domain examples, current artifact, caller/interchange contracts, permitted data sources, and the decision to make. Keep private production content out of fixtures unless genuinely required and authorized. Use incumbent measurement tools before adding dependencies.

## Required decisions

- Identify fields, units, valid states, ownership, invariants, and boundary trust.
- Preserve distinctions among missing, empty, zero, unknown, and malformed when behavior depends on them.
- Use simple data-driven rules where they express stable facts; avoid a generic interpreter for a few conditions.
- For empirical work, state hypothesis, primary outcome, workload, meaningful target, and correctness guardrails before selecting a favorable result.
- Capture an observed baseline and repeatable comparison, preserving relevant environment, distribution, failures, and variation.
- Distinguish fixture observation, production trend, causal experiment, and inference. Accept, reject, or investigate rather than manufacturing a favorable story.
- Verify exact producer/consumer interchange when the changed contract crosses language or process boundaries.

## Progressive disclosure

references/domain-models.md supports invariant examples, field semantics, policy representation, and interchange contracts. references/measurement.md handles denominators, comparable workloads, cold/warm behavior, variability, confounding, and decision limits.

## Output and evidence

Return the relevant model/invariants or hypothesis/baseline/comparison, actual commands/procedure and artifact identity, observed results, decision, and limitations. No imagined timings or unsupported speedup claims. Preserve useful public-behavior regression examples.

## Acceptance cases

Existing cases are in evals/language-scenarios.md. Expanded decisions:

1. An unknown observation remains unknown instead of becoming zero in a total or mean.
2. A focused export bug is settled by a reproducing public-behavior test without expanding into a benchmark project.
3. A cache experiment that misses its stated user target or worsens error behavior is rejected despite one favorable timing.
4. Before/after traffic data with changing request mix is described as an uncertain observation, not causal proof.
5. Cold and warm results are labeled; failed attempts are retained rather than removed from the denominator.
6. A serialization change checks actual producer/consumer values, including relevant null/absence and units, rather than relying on matching local types.
7. If no meaningful threshold was supplied, exploratory comparison is labeled as such instead of inventing a percentage target.

## Evaluation status and authorship

Original Proofwork instructions and examples. Scenario descriptions are not executed benchmarks. Prior broad baseline did not establish these experiment decisions; actual evaluator artifacts and limitations are maintained separately.
