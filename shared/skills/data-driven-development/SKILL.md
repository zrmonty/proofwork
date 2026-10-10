---
name: data-driven-development
description: "Use for domain modeling and engineering experiments; establish decisions from explicit data and observed evidence."
---

# Data-driven development

## Inputs
Collect the domain examples, current behavior, proposed decision, observable success criterion, and permitted data sources. Determine whether the task needs data modeling, an experiment, or both.

## Workflow
1. Describe the data that changes: meaningful fields, valid states, invariants, and owner. Use representative sanitized examples, including empty and invalid cases.
2. Express decisions as transformations of that data where practical. A lookup table is useful when entries represent stable domain facts; do not build a configuration language for two branches.
3. For an empirical claim, record a hypothesis and decision threshold before changing the system. Capture the current behavior with a repeatable command and representative workload.
4. Change one justified cause, rerun the same measurement, and compare correctness as well as resource/time results. Record environment, repetitions, variability, and relevant end-to-end effects.
5. Accept, revise, or reject based on the evidence. If the proposed improvement cannot be measured, report it as unproven rather than fabricating numbers.
6. Keep regression examples that observe the public behavior. Cross-language work needs a producer/consumer contract check in addition to unit checks.

## Outputs
A compact data/invariant model, hypothesis and baseline when applicable, experiment artifacts, decision with reasons, and evidence identity.

## Boundaries
This is not a mandate for a memory-layout rewrite, domain-driven-design ceremony, analytics system, or benchmark dependency. Never expose private production data to make fixtures convenient.

## Behavioral cases
A cache that misses its predefined success threshold is rejected; malformed data cannot silently become success; a baseline is never reconstructed from imagined timings. See language-scenarios.
