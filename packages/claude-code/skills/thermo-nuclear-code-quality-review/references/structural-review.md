# Structural review examples

Read when evaluating state models, wrappers, failure boundaries or file-growth concerns. These examples demonstrate review reasoning; they are not findings to paste into unrelated code.

## Contradictory state

An operation stores `isRunning`, `isComplete` and an optional result independently. Callers repeatedly decide which combinations are valid. A useful review traces actual writes and shows a reachable contradiction or the duplicated rule, rather than assuming booleans are always wrong.

A supported finding might say: “In the completion path, `isComplete` is set before the result is saved; readers can observe completion without a result. Both the UI and retry loop contain their own precedence rule. Represent pending/running/completed-with-result as explicit states owned by the operation, and keep failure/cancellation transitions explicit. Preserve the response format and verify partial-save failure.”

This is a structural concern with correctness consequences. The remedy earns its complexity by eliminating invalid combinations and caller predicates. Merely renaming the flags or relocating them does not resolve it.

Clean counterexample: two independent feature toggles represent unrelated options, and no state combinations are invalid. Do not replace them with a state machine to satisfy a pattern preference.

## A wrapper that earns its existence

A helper forwards arguments to another helper without changing semantics, handling effects or hiding a meaningful contract. Trace its callers and ask what domain concept or compatibility boundary it owns. If none, removing the layer may reduce reader work while preserving behavior.

A resource wrapper can look similarly small but guarantee cleanup on errors/cancellation. Inspect that obligation before deletion. A feasible finding names the forwarding chain, shows the redundant call layer and states the signature/error behavior to preserve. “Too many abstractions” without the chain and contract is not actionable.

Clean counterexample: a repository wrapper centralizes query policy or transaction lifetime for several callers. Its brevity does not make it redundant.

## Hidden effect in a decision

A pricing or retry decision reads the wall clock and shared mutable settings internally. Reproducing a particular result requires coordinating ambient state. A narrower design may take time/settings as inputs and leave external writes to the boundary.

Demonstrate the actual dependency and testing/change cost. Do not demand a universal effect framework. For a local CLI timestamp appended at the output boundary, direct clock access may be appropriate. For retryable writes, inspect persistence and idempotency: pure calculation alone does not settle exactly-once effects.

## Apparent duplication at trust boundaries

Validation appears both on an external request and on a separately consumed imported file. Investigate whether they share the same trusted representation. If they are different external boundaries, both checks may be required even if a common parsing helper is useful.

Do not delete a guard because a previous caller validated once. The preservation constraint includes alternate entry points and error behavior. A review can accept the duplicated boundary check and still suggest a shared domain parser when its contract clearly fits.

## File violates the hard maximum

Inspect whether routing, persistence and domain transitions have distinct responsibilities. A coherent remedy might move persistence behind an existing boundary while leaving pure transitions together. Preserve error handling, transaction boundaries and callers, then check both behavior and resulting file sizes. Scattering related cases across tiny forwarding files does not satisfy the structural review.

For generated application code, adjust the generator to emit meaningful bounded modules and verify a fresh generation. Do not reformat several statements onto one line, discard explanations or reclassify code as data to disguise the violation.

A large cohesive file is not automatically a defect. Identify competing responsibilities or a demonstrated change cost before proposing a split; preserve ownership and authorized scope.

The automatic checker inventory is a starting point. A checked-in `.py` test counts as project code; a project-owned extensionless executable or ignored generated source must be added through the supplementary JSON inventory. A Markdown manual and an external dependency installation are outside the code-file count. Document the inspected boundary and any unavailable generated output; missing inventory evidence cannot support full acceptance.

## Compare remedies before prescribing one

Probe a structural concern with a concrete change: if one business rule changes tomorrow, which owners must be updated and which unrelated consumers are affected? Trace the actual locations rather than counting layers or guessing from names. Several files can legitimately own different rules. Several pure functions can still duplicate the same policy and drift. Neither file count nor functional style settles ownership.

Compare the smallest local remedy against a broader model change. Name what each removes, which contracts it preserves and any added indirection. A new abstraction is justified only when its useful ownership or boundary outweighs that cost for current consumers. When two remedies are reasonable, state the tradeoff rather than presenting one stylistic preference as the only acceptable design.

For integrated parallel work, inspect the contract at the seam: do consumers use the new authoritative rule, do old paths still maintain a second state, and do success and failure responses mean the same thing on both sides? Separate worker tests can pass while the combined callers still use incompatible assumptions. A review of the integrated artifact should identify that mismatch and its preservation checks; it must not claim unseen integration was tested.

Counterexample: a transaction wrapper, domain calculation and transport adapter can be a coherent three-layer design with separate obligations. Collapsing them to reduce the layer count may obscure cleanup or public error handling. Accept that design when the traced contract earns the boundaries. Conversely, moving a duplicated predicate into another file without migrating the old callers leaves the original finding unresolved.

## Useful verdicts

**Needs restructuring:** describe the material mechanism, smallest adequate remedy and checks preserving behavior. Cosmetic preferences can remain nonblocking and should not inflate this verdict.

**Meets the bar:** explain why the important invariants, ownership and effects are coherent within scope. It is acceptable to report no findings. Do not recommend speculative generalization just to make the review look busy.

**Insufficient evidence:** identify what prevents judgment, such as a missing consumer necessary to evaluate whether an abstraction duplicates existing ownership. Ask for that context or inspect it if available; do not turn missing evidence into an assumed defect. The reviewer can still report supported scoped observations without claiming a full verdict on unseen behavior.

After revision, inspect whether the proposed owner actually became authoritative. Old predicates may survive in callers after a new state model is introduced. Re-review the original concern and nearby consequences, then report current evidence rather than repeating the original finding after it has been resolved.
