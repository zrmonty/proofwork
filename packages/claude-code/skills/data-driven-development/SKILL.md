---
name: data-driven-development
description: Model domain data with clean pure transformations and state transitions; evaluate decisions with representative observations and reproducible comparisons.
---

# Data-driven development

Model the facts needed for the decision; measure outcomes when the task makes an empirical claim. Do not build an experiment for an obvious defect already settled by a meaningful regression.

Name units, owners, identities and valid states clearly. Preserve distinctions between absent, empty, zero, invalid and unknown when behavior differs. Decode and validate external values before pure transformations. Stateful decisions return next values and intended effects; adapters own collection, commits and observed outcomes. Preserve raw observations and caller inputs.

Read [data workflow details](references/workflow-details.md) for cross-language contracts, empirical comparisons or evidence delivery. Read [domain models](references/domain-models.md) for shared invariants, [corrections and lineage](references/corrections-and-lineage.md) for replacement or incomplete snapshots, and [measurement](references/measurement.md) for representative workloads, selection policy and uncertainty.

Before comparing candidates, establish the hypothesis, baseline, meaningful decision threshold and correctness guardrails. Collect observations separately from analysis. Compare the same workload and artifact identities; disclose missing rows, changed denominators and variation. Keep inconvenient results. A result can reject a proposed change.

Deliver the model and invariants, or actual baseline/candidate observations and the decision they support. Distinguish synthetic checks, production observations and inference. Never invent a baseline or turn a single favorable run into a general improvement claim.
