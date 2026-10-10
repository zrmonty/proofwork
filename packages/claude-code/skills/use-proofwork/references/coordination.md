# Coordination and integration

Read before substantial delegation, shared interfaces or combined design work. Use the assignment contract for records, not a second schema.

## Independent slices need stable contracts

Separate files alone do not make work independent: schemas, error formats, caches, transactions and state policies cross paths. Resolve shared interfaces before dependent edits.

- One boundary-condition fix: one owner; additional editors rarely help.
- Unclear failures: distinct read-only investigators, then one rule owner.
- API/UI with agreed responses: disjoint ownership after shape/error/state agreement.
- Competing implementations: isolated checkouts and bounded comparison.
- Generator/output: generation owner; coordinator rebuilds after collection.
- Shared type/style: one owner or isolated work with sequential integration.

Assignments state owned and excluded work concretely: “Pagination in src/export.ts; exclude shared response type and regenerated packages.” Revise affected assignments when contracts change, before dependent writes. Never overwrite another owner's changes.

## Example scales

For final-page export truncation, inspect owner/callers, reproduce multipage failure, check single-page/empty behavior when meaningful and preserve input mutation. Direct implementation plus evidence is enough; available review roles do not make every role necessary. An unavailable regression stays unproved, not passing by inspection.

For article index/detail views, agree content fields, URLs, loading/errors and design direction. Workers own separate views; coordinator owns shared schema/tokens/generated output. UI workers share frontend guidance and typography/spacing/radius decisions. Integrate sequentially and inspect consumers. Verify combined navigation, long headlines, empty/error states, desktop/mobile and keyboard flow; separate screenshots do not establish coherence.

## Role and model evidence

Preserve session model unless supported selection is authorized. Match roles to demonstrated context/tool/reasoning capability, not named-model stereotypes. Honor supplied limits and record requested/actual metadata when exposed; unknown stays unknown. Cross-provider work requires a configured bridge.

Independent reviewers receive objective, contract, artifact and raw evidence without an implementer's conclusion as the answer to confirm. They may inspect rationale but challenge it against observed behavior. A different model does not guarantee independence or correctness.

## Integrated acceptance

Worker handoff is provisional. Inspect outside-advertised changes, callers, failure paths, existing utilities and check relevance. Request narrow revisions when contracts are incomplete. Resolve accepted findings with verified fixes; rejected findings need supported reasons. “Tests pass” does not answer an ownership/race concern.

After integration, capture content identity including relevant uncommitted files. Revalidate checks affected by later slices/dependencies and record coordinator acceptance on that identity. Do not relabel old evidence mechanically. Reuse only when its actual covered content/dependencies remain valid; required criterion records must match the integrated artifact.

## Critical path and crossed contracts

Name the decision/artifact each dependent slice awaits. Read-only investigation can proceed independently; unresolved transaction/response contracts cannot be guessed by implementers. More agents can increase assumption conflicts, setup duplication and integration delay.

Blocked workers identify the specific missing input. Reassign unaffected work after reconciling ownership, not by introducing a competing contract. Repeated failures on one assumption call for investigation rather than replacement-worker churn.

Check successful behavior and user-visible failure across slices. Export generation can pass while a stale download link serves the previous job. Shared job identity/state is an integration criterion; generator tests and isolated UI screenshots cannot prove it. Keep this crossed behavior in acceptance and obtain evidence that reaches it.
