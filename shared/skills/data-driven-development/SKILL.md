---
name: data-driven-development
description: Model domain data and evaluate engineering decisions with representative observations, explicit hypotheses, and reproducible comparisons.
---

# Data-driven development

Use data to clarify the decision, not decorate a preferred answer. Separate two activities: modeling the domain's facts and states, and measuring whether a change improves an outcome. Many tasks need only the first.

## Model the data that matters

Start with representative sanitized examples and the behavior they drive. Name the meaningful fields, units, valid states, identifiers, owner, and invariants. Distinguish missing, empty, zero, unknown, and invalid when they cause different behavior. Record where external data becomes trusted and how errors remain visible.

Choose a shape that makes the requested rule direct. A table can express stable mappings; an explicit state can rule out contradictory flags; a plain sequence can preserve order. Do not build a configuration language for two branches or reorganize storage for an unmeasured speed claim.

Keep transformations pure where practical and keep writes at the owning boundary. For producer/consumer or cross-language changes, identify the wire shape, units, null/absence behavior, ordering, and version compatibility. Check the real interchange rather than assuming equivalent internal types serialize identically.

Read [domain models and examples](references/domain-models.md) for difficult invariants or shared data contracts.

## Make empirical claims falsifiable

Use an experiment when the assignment makes a measurable claim: performance, resource use, reliability, conversion, quality, or a suspected regression. State the hypothesis, primary outcome, representative workload, meaningful decision threshold, and correctness guardrails before selecting a favorable result. A threshold should come from the user's need or existing target, not an invented impressive percentage.

Capture a baseline from the current artifact with a repeatable command or procedure. Read [measurement and decisions](references/measurement.md) when comparing performance or product outcomes, designing evaluation datasets, or using production observations. Record how inputs were selected and the environment that could explain the result. Compare like with like and retain inconvenient observations. Prevent tuning or preprocessing from leaking evaluation data into the candidate being judged.

Change the suspected cause, rerun the comparison, and account for variation. Reject or narrow the claim if correctness worsens, costs shift elsewhere, or representative behavior fails the threshold. A negative result can save unnecessary code; it does not need to be reframed as a success.

## Keep evidence honest and economical

Record commands/procedure, artifact identities, data selection, observed values, variability, and the resulting decision. Distinguish a fixture result, production observation, controlled experiment, and inference. A single favorable run can justify another test; it cannot establish a general speedup.

Use existing tools before adding instrumentation or benchmark dependencies. For an obvious correctness defect, a reproducing public-behavior test can settle the decision without a benchmarking project. Do not collect private production content when synthetic or sanitized data answers the question.

## Deliverable

Return the data model and relevant invariants, or the hypothesis/baseline/comparison when empirical work was needed. State whether evidence supports accepting, rejecting, or further investigating the change. Keep useful regression examples and disclose measurements that were unavailable. Attach evidence to the actual current artifact; imagined baselines, unsupported causal claims, and fabricated benchmark numbers are failures.
