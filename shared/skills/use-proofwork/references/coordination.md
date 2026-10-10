# Coordination and integration

Read before substantial delegation, shared-interface work or combined design implementation. Use the assignment contract as the record format; the examples below explain decisions rather than adding schema fields.

## Choose a useful split

Ask whether each slice can proceed from the same stable contract without editing the same owner or guessing another slice's behavior. Separate files are necessary for a shared checkout but do not establish independent semantics. Two modules can still compete over a schema, error format, cache or transaction.

| Situation | Useful choice | Why |
| --- | --- | --- |
| Fix one export boundary condition | One implementer, focused review if warranted | Splitting reproduction and implementation across concurrent editors adds coordination without independence |
| Unclear failure across several consumers | Read-only investigators for distinct questions; one owner fixes the rule | Independent evidence is useful before choosing edits |
| API plus UI using an agreed response | Separate owned slices after agreeing shape, errors and states | Both workers can implement without designing incompatible contracts |
| Competing implementations of one module | Isolated checkouts and bounded comparison | Shared writes would corrupt the comparison |
| Generator plus generated packages | Generator owner; coordinator rebuilds after collection | Output cannot be treated as an independently maintained slice |
| Two workers both need a shared type | Coordinator resolves ownership/interface first | “Only a small edit” still creates conflicting writes |

An assignment states excluded work as concretely as owned work. “Implement pagination in src/export.ts; do not edit the shared response type or regenerated packages” is reviewable. “Handle the data side” is not. If a contract changes, tell affected workers and revise assignments before they continue dependent writes.

## Small task: export truncation

The request is to include the final page. Inspect the export owner and callers, reproduce multi-page truncation, and verify single-page and empty input where they exercise the changed boundary. Keep input mutation behavior unchanged. A coordinator can implement directly and return the regression evidence; a second implementation agent adds little. Do not launch architecture, security and visual reviews merely because those roles exist.

If the check cannot run, report why and which criterion remains unproved. A code inspection can support the diagnosis but cannot be labeled a passing regression.

## Substantial task: article index and reading view

Set the shared content fields, URL behavior, loading/error states and design direction before dispatch. Give one worker ownership of index files and another of article-detail files; a coordinator owns shared tokens/schema and final generated output. Each UI worker reads the frontend skill and direction. Do not allow each slice to choose independent typography, spacing or radius systems.

Integrate the first slice, inspect changed consumers, then integrate the second. Exercise navigation, long headlines, empty/error content, desktop/mobile and keyboard flow on the combined artifact. A visual reviewer compares rendered hierarchy against the agreed brief. Separate worker screenshots do not prove the combined routes or shared styling remain coherent.

If workers need the same stylesheet, either assign that stylesheet to one owner and agree its interface or isolate work and integrate sequentially. Shared file ownership is not solved by asking both workers to be careful.

## Choose model roles from evidence

Preserve the session model unless supported selection is authorized. When a role policy exists, match the work to demonstrated capability: investigator context for tracing callers, implementation tool access, reviewer reasoning about state and failure paths. Faster execution may suit a stable local transformation; unfamiliar concurrent behavior may need more context and careful review. These are task needs, not fixed claims about named models.

Independent review should receive the objective, contract, artifact and raw evidence. Avoid presenting the implementer's conclusion as the answer to confirm. A reviewer may read the implementation rationale but must examine it against observed behavior. A different model alone does not make a review independent or correct.

Record requested/actual metadata when exposed and honor supplied limits. If the actual model is unknown, leave it unknown. No cross-provider dispatch is assumed without an explicitly configured bridge.

## Accept a result on the integrated artifact

A worker handoff is provisional. Inspect changes outside the advertised files, failure paths, existing utilities and test relevance. Return a narrow revision request when the behavior or contract is incomplete; do not silently reassign broad work that hides the cause.

After integration, record a new content identity that includes uncommitted relevant files. Rerun checks affected by later slices or dependencies and record coordinator-accepted task results at that identity. Do not mechanically relabel old evidence with the new identity. Evidence can be reused only when its actual covered content and dependencies remain valid, and the completion guard requires current criterion records with matching artifacts.

For a rejected review finding, record the supported reason: for example, the supposedly duplicate guard covers a separate external boundary. “Tests pass” does not answer a concern about ownership or races. For an accepted finding, verify the fix and review nearby consequences before marking it resolved.
