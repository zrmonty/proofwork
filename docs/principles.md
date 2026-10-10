# Decision references

Principles are conditional references, not independent skills. Fifteen separately listed entries made closely related judgments compete for discovery and loaded overlapping instructions together. Seven references now answer distinct questions and defer detailed procedure to its owning skill. Light work loads none: core instructions and tier policy already cover effort, caller ownership and honest reporting. Record a principle only when it changes a decision.

| Reference | Distinct question | Detailed owner |
| --- | --- | --- |
| [Design economy](../shared/skills/use-proofwork/references/principles/design-economy.md) | Which current requirement justifies this mechanism over reuse, consolidation or removal? | architecture-fit, language-fit, dead-code-audit, dry-audit |
| [Preserve contracts](../shared/skills/use-proofwork/references/principles/preserve-contracts.md) | Which supported guarantees must survive the change? | trace-path, impact-map, language guidance |
| [Evidence boundaries](../shared/skills/use-proofwork/references/principles/evidence-boundaries.md) | What does this observation establish, and what remains unknown? | evidence-surface, tdd-95, performance-increase |
| [Reproduce before fix](../shared/skills/use-proofwork/references/principles/reproduce-before-fix.md) | What distinguishes the failure from correct behavior? | Repair Behavior, tdd-95 |
| [Production readiness](../shared/skills/use-proofwork/references/principles/production-readiness.md) | Has the delivery artifact been checked in the claimed environment? | production-finish, security-hardening |
| [User authority](../shared/skills/use-proofwork/references/principles/user-authority.md) | Which consequential choice needs intent, facts or authority? | brainstorm, host action rules |
| [Staged work](../shared/skills/use-proofwork/references/principles/staged-work.md) | Which prerequisite must settle before another unit integrates? | full coordination, recovery |

Design economy combines smallest-adequate, subtract-before-expanding and earn-the-component. Proportionate-effort belongs to tier selection. Evidence boundaries combines prove-the-journey, explain-what-is-proved and no-concealment-risk. User authority combines intent-stays-with-user and reveal-consequential-decisions. Boundary-discipline and the language-fit principle defer to existing core, security and language-fit guidance; their actual implementation rules remain intact.

The [index](../shared/principles/index.json) uses schema version 2: slugs map to references. Explained routing returns `principles` as IDs and `principleReferences` as package-relative paths. Context budgets and evaluation injection read each selected reference once. Plain routing is unchanged.

The old `$pw-principle-*` and `/proofwork:pw-principle-*` commands are removed. Use the ordinary Proofwork entry or the owning skill. Aliases would reintroduce discovery overhead. Historical run records keep their original IDs; past evidence is not rewritten. No reference grants permission or certifies an unobserved result.
