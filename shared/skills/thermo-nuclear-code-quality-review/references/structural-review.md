# Structural judgment at the integrated seam

This lens decides whether the combined artifact has coherent responsibilities, invariants and effect ownership. It does not repeat [DRY classification](../../dry-audit/references/duplication-decisions.md), [deadness proof](../../dead-code-audit/references/reachability-and-tests.md) or [refactor mechanics](../../pw-clean-code/references/contract-preserving-refactors.md). Delegate those obligations and retain their evidence in the finding.

## Reachable contradictory state

Running/completed flags plus optional result are concerning when actual writes permit completed-without-result or consumers encode competing precedence rules. Trace that mechanism. A useful remedy owns pending/running/completed-with-result and explicit failure/cancellation transitions while preserving wire behavior and partial-save handling. Relocating flags does not fix contradictions. Independent feature toggles with no invalid combination need no state machine.

## Unearned layers and hidden effects

Trace a forwarding chain and identify what each layer owns. Remove only a layer hiding no useful domain, compatibility, cleanup or policy contract. A query-policy or transaction wrapper can earn its existence despite its brevity. Compare a local removal with a broader model change: what responsibility disappears, which consumer contracts remain, and what new indirection is introduced?

A price/retry decision using ambient clock/settings may impose reproducibility and change costs. Demonstrate those dependencies before moving them to inputs. Do not require an effect framework for a CLI timestamp at an output boundary; pure calculation cannot supply remote exactly-once delivery.

## Integration rather than shape quotas

Ask where a real business-rule change would propagate and which unrelated consumers it would disturb. Several files may own distinct rules; several pure functions may still duplicate one rule. Layer count and functional syntax do not settle ownership.

Inspect caller adoption after a new owner is introduced. Old predicates, state copies or response meanings can survive even when each worker's tests pass. Review success/failure contracts across the seam, canonical state, authority and resource lifetime. Never claim unseen integration was exercised.

Large files warrant restructuring when responsibilities compete or change friction is demonstrated, not because of a universal line ceiling. Splitting into tiny forwarding files can make that friction worse. Generated structural problems belong in the generator and require fresh-generation evidence.

Boundary validation may intentionally appear at separately consumed request/import entry points. Use DRY's policy-versus-enforcement distinction rather than deleting a necessary guard. A transport adapter, transaction wrapper and domain calculation may form a coherent design; collapsing them can erase cleanup or public error handling.

## Verdict and re-review

Needs restructuring names the material mechanism, smallest adequate remedy and preserved-contract checks. Meets the bar explains coherent important invariants within the inspected scope. Insufficient evidence identifies the missing consumer/observation without inventing a defect; supported scoped findings can still be returned.

After revision, verify that the proposed owner became authoritative and recheck nearby consequences. Stop repeating resolved findings. Cosmetic preferences remain nonblocking and no finding quota applies. Record actual artifact identity and evidence through [finding disposition](finding-disposition.md).
