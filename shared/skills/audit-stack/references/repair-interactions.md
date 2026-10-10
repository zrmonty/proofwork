# Repair interactions

Read when several audit lenses propose changes to the same behavior, or a repair improves one metric while weakening another contract. Coordinate one remedy rather than treating each lens as a separate rewrite.

## Follow the shared mechanism

An export cache omits the tenant from its key. Security sees disclosure, performance sees repeated serialization, DRY sees two key builders, and tests show only one tenant. These are related observations, not four independent features.

Name the preserved contract first: an authorized caller receives only the allowed records in the requested representation, with the supported freshness policy. Then choose the owning boundary and the smallest coherent repair. A pure key builder may consolidate representation rules, but it cannot authorize a request. Deleting the cache may close disclosure while increasing work; that tradeoff needs measurement rather than an automatic rejection or acceptance.

Keep the relevant checks distinct:

| Obligation | Evidence that reaches it |
| --- | --- |
| Tenant isolation | Two synthetic tenants use the actual cache/route path; one never receives the other's records. |
| Permission changes | A formerly authorized caller cannot reuse retained output contrary to the application's policy. |
| Representation correctness | Supported filters, ordering and format produce the intended content. |
| Performance | Equivalent completed work, including failure counts, is measured before and after. |
| Maintainability | Consumers share the real key contract without a second policy owner. |

These checks can share fixtures, but one assertion does not establish every obligation.

## Resolve competing remedies

Dead-code findings precede extraction: do not preserve an unused branch merely because two copies can be combined. Conversely, an apparently unused handler may be a supported dynamic entry point; investigate that root before deleting it or counting it as audit savings.

A DRY proposal that merges independent access checks can remove defense at an external boundary. Consolidate the policy's knowledge where appropriate, while preserving enforcement at every required boundary. Similar syntax with different authority or failure semantics may need separate adapters.

A performance proposal that caches permission results needs a validity and invalidation contract. If that contract is absent, do not trade security for a lower median. Explore a simpler safe optimization or record the measured cost of the security repair.

Test consolidation preserves distinguishing assertions and relevant failure mechanisms. Removing duplicate setup is different from collapsing every invalid input into one broad test that hides which boundary failed. Keep separate line and branch floors at least 95%; correct inventory changes are recorded, never selected to improve the percentage.

## Integrate in an explainable order

Choose the order from actual dependencies. An enforcement fix can be necessary before profiling the correct workload; dead-code removal can change which duplication remains. Read-only investigations may proceed independently when authorized, but modifying owners cannot concurrently patch the same helper or generated output.

After each integration, identify which assumptions changed and invalidate affected observations. A benchmark taken before a new authorization query cannot certify the final path. An earlier coverage report cannot certify a later extraction. Reuse unaffected checks only through explicit content and environment dependencies.

## Close the ledger honestly

Record one root finding with its lens-specific obligations, remedy and final status. A security fix can be verified while its latency impact remains unmeasured; those are separate conclusions. No finding count, removed-line count or passing aggregate command establishes the audit's completeness.

For unresolved tradeoffs, report the concrete decision needed and available alternatives. Do not introduce queues, distributed caches or migration work solely to satisfy a lens. Keep every resulting code file within 500 physical lines and apply the actual language/type gates to affected consumers and tests.

The scenario is illustrative. It supplies no benchmark result, executed security check or target-application verdict.
