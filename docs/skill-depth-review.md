# Skill depth revision

This standard covers all twenty-two Proofwork skills. Depth means the skill helps an agent choose and verify a better approach in a real task. Additional length alone is not a quality measure. Earlier revisions remain recorded separately; full reviews include language, functional/data logic, product/design, security, cleanup and coordinated audit/delivery workflows.

The [product vision](vision.md) makes skill compression the main goal. A deeper skill should reduce the mechanism-specific knowledge a user needs while preserving inspectable engineering quality. Evaluate whether the root can select and apply it from ordinary intent; more commands, detail or agent activity alone is not progress.

## Authoring standard

Each entry should identify its inputs, the decisions it owns, the evidence its outputs need and the boundaries it must preserve. Conditional examples and specialist procedures belong in linked references, with a clear reason to load each. Shared coordination and evidence rules live in contracts rather than being repeated in every entry.

A new reference needs a distinct decision area, not another phrasing of the entry. Show a representative trigger, competing options, the mechanism that makes one fail, a bounded remedy and the evidence needed to accept it. A worked scenario is instructional evidence only; label it separately from executed verification. Check nearby references before adding shared policy, and link the existing owner instead of creating competing rules.

A useful rule explains a consequence or tradeoff: which state to represent, which responsibility to remove, which observation would disprove a hypothesis, or which effect remains uncertain after a timeout. Examples must be originally written and internally consistent. Technical examples follow the project's toolchain and are checked where tools are available. An idiomatic loop or useful local mutation is not a violation of the functional default.

Descriptions should route a task accurately before loading the body. Writing should be direct, specific and proportionate to the work. Avoid universal architecture prescriptions, novelty quotas, bureaucratic steps for trivial work and declarations of success without observations.

## Review gates

- Every canonical skill has a corresponding specification and all package-local references resolve in both builds.
- References are reachable from their entry through a specific loading trigger. Specifications describe their decisions and acceptance cases. Avoid orphan files, mandatory loading of every reference, duplicated checklists and unverifiable claims of improvement.
- Runtime contracts, command forms, ownership and native goal semantics remain compatible with the existing tools.
- Architecture challenges every consequential component against a simpler adequate arrangement. The functional default permits measured private loops; every project code file remains at or below 500 physical lines, with no generated/existing-code exception. Complete function definitions have a hard 10-physical-line maximum; below-cap complexity still requires review, and function inspection evidence is separate from the bundled file gate.
- Coverage uses separate 95% line/branch floors, independent source discovery and truthful collection provenance. Consolidation retains unique failure detectors; performance comparisons preserve workload, completed work and resource tradeoffs.
- Release and UI wording describe actual states and consequences. Secret checks redact before output; a source review, fixture or package validator never becomes an exhaustive safety, rendered or production-readiness guarantee.
- Language guidance distinguishes runtime validation from static types, caller data from owned data, and domain decisions from resource/effect management.
- Python requires an actual strict type gate over implementation, affected callers and tests. Functional defaults cover data transformations and as much changed stateful decision logic as possible, with authoritative effect boundaries preserved.
- Frontend guidance derives composition from content and tasks, supports coherent softer forms, and requires actual rendered evidence for visual claims.
- Review guidance permits a clean verdict and makes each finding concrete, scoped and behavior-preserving.
- Commit guidance preserves shared history, describes actual outgoing changes and keeps feature size independent of version semantics.
- Combined audits merge common causes without dropping separate evidence obligations. Dead-code removal retains supported consumers; DRY consolidation preserves distinct policies and useful test detectors. Security results redact before output and distinguish local fixes from external response.
- Fresh evaluators exercise selected skills against realistic prompts without being shown the intended answer. Record interventions and missing tools. Passing a few cases does not establish comparative improvement or full host certification.

## Forward evaluation cases

1. **Coordination after integration:** tests pass on one snapshot; an integrated worker changes a relevant dependency; time is short and a prior remote action has an uncertain outcome. The response must reconcile identity/effects, check affected behavior and preserve incomplete status when necessary.
2. **Boundary and ownership implementation:** process a small typed data fixture while preserving caller-owned nested records and rejecting malformed input. Observe the implementation and checks, not recitation of principles. Record unavailable language tools explicitly.
3. **Editorial direction with incomplete tools:** propose a direction for realistic publication content in an incumbent design, with no browser available. Assess composition, tradeoffs, responsive/accessibility planning and honest limits; textual planning cannot count as rendered verification.
4. **Positive maintainability case:** review a simple pure result implemented with a private accumulator and a loop. It should remain intact unless a concrete defect is demonstrated.

Executed results are in the [skill depth verification report](../evals/results/skill-depth-20261010.md). These cases establish scoped behavior under the tested capabilities; no quality multiplier or benchmark gain is assumed.

The [second full review](../evals/results/skill-depth-round2-20261010.md) covers all seventeen skills, with independent source review, forward-use decisions and an executed Python red/green fixture using real separate line/branch coverage. It records intermediate failures and the limits of the tested cases.

The [all-skill reference expansion](../evals/results/references-expansion-20261010.md) adds a conditional guide to each of twenty-one skills, with specification mapping, independent source review and separate hypothetical reasoning observations. Use the [reference guide](reference-guide.md) to find the applicable material. Structural checks do not turn the new authored scenarios into executed project evidence.
