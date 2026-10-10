# Specification: setup

## Purpose and inputs

Determine what a Proofwork run can actually execute and prove without incidental changes to the environment. Inputs are live host tools/adapters, project instructions/manifests/checks, task criteria, model policy and user limits.

## Decision contract

Inspect relevant access and distinguish supported, unavailable and unknown with observations. Ordinary shell, interactive TUI, browser, authenticated sessions, native desktop, delegation, checkout isolation and goals are distinct. Select roles and models within existing policy; fallback never silently changes defaults. Map each required criterion to an actual check or observation, retaining specific gaps. Avoid exhaustive capability inventory irrelevant to a small task.

Conditional examples and role tradeoffs live in references/capabilities.md. Setup returns a concise coordinator capability/role/check plan, not a daemon or general provisioning operation.

## Observable acceptance cases

- A parser task checks its language/toolchain and test path without probing browser/native desktop access or provisioning a general environment.
- A listed shell binary whose execution is denied is not called verified execution. An installed browser library is not treated as authenticated browser access.
- A UI task with absent browser tools proceeds with useful code checks while rendered/interaction acceptance remains unproved.
- A rejected CLI model is reported with the exact attempted run. An authorized fallback is per-invocation and leaves default settings intact; no policy means no silent substitution.
- Requested/actual model metadata is recorded when exposed and remains unknown otherwise. Native subagents are not represented as a cross-provider bridge.
- A modest change combines responsibilities where useful; a complex contract change receives reviewers with the combined artifact and required context.
- A substitute check is accepted only for the same proved behavior. A service mock does not establish required service-backed behavior.
- Capability labels and next actions have evidence and relate to the task. Setup does not create a goal, install tools, expose credentials, launch services or change global configuration incidentally.

## Evidence and boundaries

references/verification-isolation.md covers command reach, hidden prerequisites and owned verification cleanup. A destructive fixture reset using the normal application connection is not run until its destination is established as isolated and authorized. A mock leaves required real integration unproved. A surviving child process or unknown stop is an outstanding effect; cleanup never prunes unrelated resources. Tool, assertion and environment failures receive distinct remedies, while independent coverage collection and additive code discovery retain the existing gates.

Probe the actual required path after inspecting command effects and fixture isolation. Classify assertion failure separately from unavailable tools or permissions; do not retry an identical rejection or provision unrelated capabilities. Executable-work plans inspect coverage collection/enforcement and additive code discovery, preserving unresolved legacy gates rather than promising a pass. A threshold in configuration is not observed CI enforcement.

Use real tool outcomes and inspected project commands, then observe the resulting plan/actions. Static packaging does not prove host access. A failed path should not be generalized to all host capability. Native lifecycle and permissions take precedence.

Original authorship: authored for Proofwork's capability/role needs and runtime boundaries without imported skill content. These acceptance cases are not claims that every host scenario has already run.

## Model-role setup

Explicit setup merges repository-local modelRoles/modelBudgets without overwriting unrelated options or global
settings. Missing configuration inherits session policy; empty modelRoles opts into observed capability preferences.
The read-only planner reports unresolved mappings, advisory budgets and unverified dispatch. Actual host observations
resolve access claims; unavailable models cannot fall back silently.
