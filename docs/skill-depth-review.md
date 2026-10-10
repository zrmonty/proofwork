# Skill depth revision

This revision strengthens the original guidance across all twelve Proofwork skills. Depth means the skill helps an agent choose and verify a better approach in a real task. Additional length alone is not a quality measure.

## Authoring standard

Each entry should identify its inputs, the decisions it owns, the evidence its outputs need and the boundaries it must preserve. Conditional examples and specialist procedures belong in linked references, with a clear reason to load each. Shared coordination and evidence rules live in contracts rather than being repeated in every entry.

A useful rule explains a consequence or tradeoff: which state to represent, which responsibility to remove, which observation would disprove a hypothesis, or which effect remains uncertain after a timeout. Examples must be originally written and internally consistent. Technical examples follow the project's toolchain and are checked where tools are available. An idiomatic loop or useful local mutation is not a violation of the functional default.

Descriptions should route a task accurately before loading the body. Writing should be direct, specific and proportionate to the work. Avoid universal architecture prescriptions, novelty quotas, bureaucratic steps for trivial work and declarations of success without observations.

## Review gates

- Every canonical skill has a corresponding specification and all package-local references resolve in both builds.
- Runtime contracts, command forms, ownership and native goal semantics remain compatible with the existing tools.
- Language guidance distinguishes runtime validation from static types, caller data from owned data, and domain decisions from resource/effect management.
- Frontend guidance derives composition from content and tasks, supports coherent softer forms, and requires actual rendered evidence for visual claims.
- Review guidance permits a clean verdict and makes each finding concrete, scoped and behavior-preserving.
- Commit guidance preserves shared history, describes actual outgoing changes and keeps feature size independent of version semantics.
- Fresh evaluators exercise selected skills against realistic prompts without being shown the intended answer. Record interventions and missing tools. Passing a few cases does not establish comparative improvement or full host certification.

## Forward evaluation cases

1. **Coordination after integration:** tests pass on one snapshot; an integrated worker changes a relevant dependency; time is short and a prior remote action has an uncertain outcome. The response must reconcile identity/effects, check affected behavior and preserve incomplete status when necessary.
2. **Boundary and ownership implementation:** process a small typed data fixture while preserving caller-owned nested records and rejecting malformed input. Observe the implementation and checks, not recitation of principles. Record unavailable language tools explicitly.
3. **Editorial direction with incomplete tools:** propose a direction for realistic publication content in an incumbent design, with no browser available. Assess composition, tradeoffs, responsive/accessibility planning and honest limits; textual planning cannot count as rendered verification.
4. **Positive maintainability case:** review a simple pure result implemented with a private accumulator and a loop. It should remain intact unless a concrete defect is demonstrated.

Executed results are in the [skill depth verification report](../evals/results/skill-depth-20261010.md). These cases establish scoped behavior under the tested capabilities; no quality multiplier or benchmark gain is assumed.
