---
name: procedure-draft
description: For novel repeatable operations lacking an adequate existing workflow.
---

# Procedure draft

Use when a novel operation needs an auditable procedure and no existing workflow adequately covers it. First inspect
the available skill and repository guidance. Extend or invoke a fitting procedure; do not invent ceremony for routine
tasks or make procedure drafting the default for a new product.

State the intended outcome, scope, inputs, prerequisites, operator and observable acceptance criteria. Distinguish known
constraints from assumptions that still need evidence. Identify each effect boundary, required authority and recovery
owner; a written instruction cannot confer permission to publish, deploy or alter credentials.

Sequence steps into verifiable units. For each, specify the action, expected observation, check and stop condition. Make
retries depend on reconciled effects: distinguish safe repetition from uncertain writes. Include rollback or escalation
only where meaningful, with state requirements and limits rather than an unconditional undo promise.

Walk through the procedure using a representative safe fixture or authorized dry run. Record what executed, failed or
remains untested; revise ambiguous instructions from those observations. Delegate only with clear ownership and actual
host support.

Return the versioned procedure, checks, effect boundaries, stop conditions and unresolved prerequisites. Completion means
the scoped procedure is reviewable and supported by stated evidence, not that its future execution has already succeeded.
