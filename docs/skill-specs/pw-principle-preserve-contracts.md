# Specification: pw-principle-preserve-contracts

Citable principle: `preserve-contracts`. Trigger: Use when altering behavior, interfaces or ownership.

Decision contract: Trace affected consumers and retain supported errors, cleanup, data shapes and mutation semantics. An intentional breaking change needs its actual migration scope.

Acceptance evidence: Verify representative consumers and the changed failure boundary.

Apply only to the actual assignment. The principle adds a decision lens, not a second workflow or authorization. Packaging validation establishes discoverability, not agent compliance.
