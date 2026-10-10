# Capability and role decisions

Read for an unfamiliar runtime, explicit model mapping or a missing verification capability. Keep the report tied to this task rather than listing everything a host might support.

## Evidence behind access labels

| Needed capability | Useful observation | Unsafe inference |
| --- | --- | --- |
| Shell/test execution | Project check runs in the intended checkout with recorded status | A binary exists, therefore the sandbox permits execution |
| Interactive TUI | Supported session accepts input and exposes observed output | An ordinary process command proves interactive control |
| Browser flow | Connected API can reach the task's page and perform the needed action | An automation library gives access to authenticated user tabs |
| Native desktop/Electron | A distinct supported control surface is available and authorized | Browser access grants control of all windows |
| Delegation | Live host tool supports scoped dispatch and status/result collection | Installed skill text creates team tools |
| Isolated writes | Separate checkout can be created and used under current permissions | Subagents automatically get isolated branches/files |
| Native goal | Live lifecycle tools/behavior are exposed in this host | A `/goal` string in documentation provides automatic continuation |
| Role model | Actual surface supports the authorized dispatch and exposes metadata where available | Another account or host supports the same model name |

Use unknown when discovery is incomplete. A failed operation can establish a specific unavailable path; do not generalize it into a claim that the entire platform cannot perform the task.

## Example: CLI model rejection

The configured session model is rejected by a verification CLI. Keep the user's default intact. Record the requested model, rejection and exact run that cannot start. If the user already supplied an applicable fallback policy, select a supported per-invocation fallback within it; otherwise obtain authorization before that substitution. Report the actual model when exposed and keep the verification scope bounded.

Do not silently swap a model, alter global settings, or claim the rejected run tested the skill. The model that handles the parent conversation and the model accepted by a child CLI can differ.

## Example: UI work without browser access

Inspect source, project tests and accessibility semantics where possible, and prepare a renderable artifact. Keep desktop/mobile rendered appearance and actual keyboard-flow criteria unproved. A screenshot supplied by the user can support only the viewport/state shown; it does not establish interaction behavior.

A supported alternative browser is useful only within authorization and when it exercises the required app/environment. Ask for the narrow missing access only when necessary work depends on it. Do not ask the user to choose irrelevant tooling when another already-authorized surface proves the same behavior.

## Example: smaller repository task

A pure parser fix may need shell checks and one reviewer, with no browser, TUI, desktop or cross-provider capability. Inspect the project's parser tests and language checks, preserve toolchain settings, and begin. Setup does not need to provision a general engineering environment before addressing the defect.

## Role mapping under limits

Use investigator, implementer and reviewer as responsibilities, not a mandatory headcount. A direct implementer plus one independent reviewer can cover a modest change. A larger contract change may justify separate correctness and structural reviewers; they need the combined artifact rather than independent partial diffs.

When authorized model choices exist, consider actual tool compatibility and context needs before latency. A model unable to read the full affected ownership boundary is a poor fit for integrated review, regardless of its benchmark reputation. Use observed task results to revise mappings; record limits and uncertainty without inventing usage metrics. Reassigning a role also requires reconciling its live ownership and work.

The capability plan should answer: what can run now, what evidence will it produce, what remains unavailable, and what next action resolves the important uncertainty? Store those answers in coordinator state without credentials or unnecessary user data.
