# Independent oracles and economical properties

Read this when tests repeat implementation logic, broad snapshots hide defects, generated cases lack useful assertions, or consolidation could remove distinct fault detectors. Keep the separate 95% line and branch gates; this reference strengthens what executing the code proves.

## Establish the expected answer independently

A pricing function applies a discount and rounds per item. A test helper calls the same discount helper to build the expected result. If that helper rounds at the wrong stage, both paths agree and the test passes.

Start from the actual contract, a small manually derived example, or a trustworthy existing independent implementation. Do not generate expected values by calling the changed path under a different name. Preserve units, rounding and error policy in the oracle.

| Test shape | Useful evidence | Limitation to expose |
| --- | --- | --- |
| Exact example | Specific outcome and boundary meaning | Cannot cover every input |
| Differential check | Agreement with an independent trusted path | Shared assumptions can produce shared bugs |
| Property/relation | A contract holds over varied inputs | Weak properties permit many wrong implementations |
| Snapshot | Reviewable representation or integration output | Broad acceptance can approve a regression |
| Adapter check | Correct wiring and effect behavior | A success-only fake does not establish real failures |

Choose the smallest combination that detects the changed risks. Do not replace a precise example with a property merely to reduce test count.

## Derive properties from the domain

An ordered filtering function might preserve relative order, return only eligible inputs and leave its input unchanged. It also needs a completeness detector: returning an empty array satisfies the first two statements for many inputs. A concrete mixed example or a count/membership relation can expose the missing records.

Permutation invariance is appropriate only for an unordered computation. Round-trip equality is valid only when serialization promises it. Idempotence is not universal: applying “increment one” twice should change state twice unless the event's operation identity defines duplicate delivery.

Use the project's existing property facilities or a small explicit case table. Generated input must respect stated preconditions while including meaningful invalid cases through a separate rejection contract. Keep reproducible failure inputs or seeds according to the runner, without placing private data in case names or evidence.

Shrinking a generated failure can help isolate the cause, but the smallest case may lose a relevant environment or timing condition. Retain the actual reproducing conditions when reducing them changes the symptom.

## Compare protection before removing tests

Map each detector to its fault: omitted final record, wrong inclusive bound, reordered output, escaped mutation or hidden unauthorized effect. Preserve named independent cases for distinct risks even when parameterization reduces copied setup.

For consequential consolidation, inject a representative temporary fault in an isolated copy and observe the intended assertion fail. Restore the correct implementation and run the final checks. A failing unrelated import is not evidence that the suite detected the fault; an equivalent mutation is not a missing detector.

Do not build an exhaustive mutation campaign for an ordinary small change. Target uncertainty in the proposed removal, and retain the original detector when economical evidence cannot establish its replacement.

## Keep coverage and behavioral verdicts separate

Run the selected target's independent source inventory and both aggregate >=95% gates after final changes, retaining stricter constraints. All cases must execute and propagate failures; coverage from a property generator with no effective assertion remains insufficient.

Report exact examples/properties used, representative faults detected, unresolved oracle assumptions and actual coverage counts. Authored cases are plans until executed. Even 100% coverage plus passing properties cannot certify every concurrency, external integration or security obligation.
