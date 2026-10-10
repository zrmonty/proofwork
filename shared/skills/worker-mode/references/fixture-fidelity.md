# Fixture fidelity and boundary evidence

Read when a regression may exercise a substitute path, fixtures hide the reported failure or a handoff relies on mocked effects. A small check is useful when it reaches the owning behavior; a larger passing suite can miss it entirely.

## Locate the distinction the check must expose

Trace the reported input through parsing, policy, transition, effect and consumer. Identify where the incorrect outcome first appears, then choose a fixture that preserves that mechanism. Avoid reproducing unrelated production data; synthetic identifiers, shapes and ordering can usually retain the distinguishing condition.

Write down what the check must fail on before editing. If the original code already passes, establish whether the reproduction is wrong, the fault is intermittent or the environment differs. Do not invent a red result or add an assertion that merely restates the new implementation.

## Example: cancellation during a save

A UI shows saved after a user cancels while the server request is in flight. A reducer test that sends cancel before save-start may never reach the actual race. A mocked effect resolving immediately can hide the stale completion.

Control the relevant ordering with the project's existing test mechanism: start the owned operation, observe the state identifying it, cancel or replace it, then deliver the earlier completion. Assert the current view's actual publication rule and preserved caller state. Test the matching operation's ordinary success separately.

This establishes the local event-order contract. It does not establish that cancellation stopped the server write. Inspect or separately test the effect boundary's actual persistence/idempotency contract when that is required and available. An unknown remote outcome remains unknown.

## Keep the adapter in view

| Check surface | Useful claim | Remaining boundary |
| --- | --- | --- |
| Pure policy or transition | Decision is correct for supplied validated state/events. | Actual adapter passes authoritative inputs and enforces the decision. |
| Adapter with controlled effects | Wiring, ordering and effect requests match the contract. | Real provider/storage behavior may remain unproved. |
| Isolated integration | Included real boundary behaves under the observed fixture/environment. | Live topology and unsupported external consumers are separate. |

Use the narrowest combination proving the assignment. Do not build a generic harness when the project already controls promises, clocks, records or ports. Strict Python typing applies to helpers and tests as well as implementation; a permissive fixture must not manufacture a type-check pass.

## Avoid fixture-induced false confidence

A fixture that always authorizes, omits invalid items or preloads derived state can erase the bug. Include valid and prohibited behavior where the rule requires both, and assert absence of prohibited side effects as well as the returned error. For partial batches, preserve per-item outcomes instead of assuming all-or-nothing success.

Keep fixture setup and cleanup owned and observable. Resetting shared data or killing another owner's process is outside a bounded assignment. Unhandled asynchronous assertions or leaked work can make a passing command unreliable; inspect completion and teardown through the actual test framework.

Consolidate repeated setup while retaining distinguishing assertions and test discovery. Coverage reflects the independently agreed executable inventory with separate line and branch floors; a focused fixture alone does not prove those repository gates.

## Handoff what was actually reached

Return failing-before/passing-after observations when executed, fixture identity, consumer boundary reached and exact unproved integration path. If reproduction stayed provisional, say so. A reviewer should be able to inspect the mechanism without raw private data, secret-bearing logs or a claim that mocks established live behavior.
