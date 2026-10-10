---
name: pw-principle-preserve-contracts
description: For behavior and interface changes.
---

# Preserve contracts

Use when altering behavior, interfaces or ownership.

Decision: Trace affected consumers and retain supported errors, cleanup, data shapes and mutation semantics. An intentional breaking change needs its actual migration scope.

Evidence: Verify representative consumers and the changed failure boundary.
