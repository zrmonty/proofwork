# Selecting a cleanup lens

Clean-code work removes a demonstrated source of reader/change friction without inventing a parallel audit. Trace the question a maintainer must answer—who validates, owns state, chooses a result or handles failure—and identify the unnecessary search or coupling.

Use [refactoring decisions](refactoring-decisions.md) to select ownership and useful extraction, [contract preservation](contract-preserving-refactors.md) when signatures, errors, ordering, aliases or initialization may change, and [function cohesion](function-size-and-complexity.md) for local complexity. Cohesion and real change cost matter; line counts alone cannot establish a defect.

Repeated knowledge belongs to [DRY](../../dry-audit/references/duplication-decisions.md), which distinguishes shared rules from coincidental syntax and separate trust-boundary enforcement. Deletion belongs to [reachability](../../dead-code-audit/references/reachability-and-tests.md), including dynamic/public consumers and attached test ownership. Do not recreate those procedures here.

Structural acceptance belongs to [integrated review](../../thermo-nuclear-code-quality-review/references/structural-review.md). A resource wrapper may earn its layer through cleanup, normalization or compatibility even when its happy path only forwards. Classes, loops and longer cohesive functions are not findings by themselves; dense short code may still obscure responsibility.

Choose one concrete responsibility and the smallest complete simplification. Keep names explicit and effects owned, preserve meaningful explanations and ordinary formatting, and migrate actual consumers. Do not turn a local cleanup into an architecture migration or generic framework. Existing behavior tests normally suffice; add a public seam check only when the changed responsibility lacks protection.

Report what became easier to understand, what disappeared, preserved behavior and unresolved compatibility/safety debt. No-change is valid; a supported scoped result is better than cosmetic findings presented as defects.
