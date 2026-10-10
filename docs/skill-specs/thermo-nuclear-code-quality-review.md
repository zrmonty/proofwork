# Specification: thermo-nuclear-code-quality-review

## Purpose and inputs

Give a demanding but calibrated structural maintainability verdict with actionable supported findings. Inputs are authorized paths/base/dirty scope, changed code and consumers, contracts/tests, relevant hand-authored file measurements and language/functional guidance.

## Decision contract

Trace actual invariants, interfaces, dependencies, effects and failure behavior. Find feasible simplifications that remove mechanisms rather than relocate unchanged complexity. Findings contain location, observed mechanism, practical cost, remedy and preservation constraints. Maintainability, correctness and security judgments remain distinct. Clean code earns acceptance without a criticism quota; unanswered questions are not disguised as defects.

The below-to-above 1,000-line hand-authored crossing is a presumptive blocker requiring cohesive decomposition or an explicit compelling structural exception. Exact-threshold and already-large cases are considered as specified, without invented runtime defects. Generated artifacts are evaluated through their generator.

Conditional reasoning examples live in references/structural-review.md. Give exactly one verdict: meets the bar, needs restructuring or insufficient evidence. Authorized revisions are rechecked against the original concern and nearby consequences; the coordinator owns disposition.

## Observable acceptance cases

- Reachable contradictory operation fields produce a located finding that identifies duplicated rules, explicit-state remedy and required partial-failure checks.
- Independent feature toggles with no invalid combinations do not receive a speculative state-machine demand.
- A forwarding helper without a useful contract is distinguished from a small wrapper that owns cleanup, transaction lifetime or compatibility.
- An ambient clock/shared setting in domain decisions is assessed by actual reproduction/change cost; a clock used directly at the output boundary is not automatically a defect.
- Validation at separate external boundaries is preserved. Review does not delete guards merely because a previous caller validates.
- A hand-authored 940-to-1,060-line change receives a responsibility-based remedy or supported explicit exception. File splitting alone is not evidence; exactly 1,000 lines is not the literal above-threshold crossing.
- A material ownership problem gives needs restructuring with a smallest adequate remedy and preservation checks. A scoped coherent implementation gives meets the bar with no invented findings.
- Missing consumers necessary to judge a material abstraction yield insufficient evidence with the exact missing context, rather than an unsupported defect or claimed full acceptance.
- Passing tests do not erase a structural concern. Review-only scope produces no edits, external comments or unrelated redesign.
- Revised code is checked for remaining old predicates/owners and new adjacent consequences before findings are considered resolved.

## Evidence and boundaries

Evaluation should compare reviewer decisions against deliberately flawed and clean artifacts, including feasible remedies and preservation safeguards. Record actual inspection/checks and limits; do not claim universal security/correctness certification from this verdict.

Original authorship: written to the user's review requirements and Proofwork's maintained specification. No external skill text or workflow was imported or mechanically paraphrased. These scenarios define measurable behavior for subsequent evaluation.
