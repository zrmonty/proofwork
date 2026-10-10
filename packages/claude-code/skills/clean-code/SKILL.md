---
name: clean-code
description: Simplify implementations through clear responsibilities, understandable control flow and preserved behavior, safety and compatibility.
---

# Clean code

Match the existing codebase's dominant style. Make behavior easier to locate and the next change safer. Prefer subtraction, clear domain names and one appropriate owner. Judge cohesive responsibility, control flow and preserved contracts without arbitrary length ceilings.

Trace the requested behavior through its callers and effect boundaries. Identify a concrete reader or change cost: duplicated policy, unclear state ownership, obsolete compatibility code, forwarding layers or mixed domain/transport decisions. A class or long function is not independently a defect.

Remove dead responsibilities only after checking supported roots and consumers. Share rules only when their meaning, owner and reason to change are the same. Keep distinct policies and necessary boundary validation separate. Use functional extraction only when its concrete criteria apply; private loops are valid. Do not manufacture helper chains, compress statements or change a public API solely to shorten code.

Before moving structure, preserve outputs, validation, errors, ordering, precision, aliases, initialization, authorization, cleanup and resource lifetime. Verify actual migrated callers, not only a new helper. Existing tests may already protect the change; add meaningful missing checks rather than tests of incidental shape.

For substantial restructuring, read [detailed workflow](references/detailed-workflow.md), [refactoring decisions](references/refactoring-decisions.md) and [preserved contracts](references/contract-preserving-refactors.md). Read [function cohesion and complexity](references/function-size-and-complexity.md) when evaluating a difficult routine. Use dead-code-audit or dry-audit for their specific decisions. Substantial maintainability verdicts follow thermonuclear review.

Report the clarified responsibility, removed mechanism, observed preservation checks and unresolved supported concerns. A clean result needs no invented changes. Project-specific explicit size policies may be checked by the optional file-length tool; a count is not an architecture verdict.
