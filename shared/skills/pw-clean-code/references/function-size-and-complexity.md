# Function cohesion and complexity

Read when a routine is difficult to name, trace, test or change. Proofwork imposes no arbitrary function-line ceiling. A short function can be opaque; a longer cohesive routine can be appropriate.

## Find the responsibility

State the operation in domain language and trace its inputs, decisions, result, errors and effects. Look for independent reasons to change, repeated policy, hidden shared state, nested decisions or an unclear lifecycle owner. A line count alone does not establish a defect.

Keep related rules together. Extract an operation when it owns a meaningful calculation, validation, translation or resource responsibility. Do not create numbered steps, forwarding chains or a mutable context bag just to shorten the caller. Subtract dead and duplicated responsibilities first.

## Preserve the difficult part

Extraction can change borrow/exception scope, callback timing, lock duration, transaction lifetime, cleanup, validation order and selected error. Keep those contracts visible. Preserve public consumers and wire/persisted representations unless a migration is authorized.

Use explicit states and shallow control flow when they clarify real alternatives. Private loops can be the clearest pure calculation. Avoid dense expressions, minification or deleting useful explanations for cosmetic brevity. Project-specific explicit style requirements remain applicable.

## Check the result

Exercise the actual consumer and relevant failure path. Preserve independent test oracles and meaningful fault detection. Review whether the new boundary makes the next real change easier; a helper with a new name does not automatically create a useful abstraction.

Report the supported complexity concern, its practical cost, the chosen remedy and observed preservation evidence. An understandable routine can receive a clean verdict without extraction or a findings quota.
