# Capability and role decisions

Resolve unfamiliar runtimes, model mappings and missing verification capabilities for this task.

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

If a verification CLI rejects its model, preserve user defaults and record the rejection/run. Use only an already-authorized supported per-invocation fallback; otherwise obtain authorization. Report the actual exposed model and bounded scope.

Do not silently swap a model, alter global settings, or claim the rejected run tested the skill. The model that handles the parent conversation and the model accepted by a child CLI can differ.

## Example: UI work without browser access

Inspect source, project tests and accessibility semantics where possible, and prepare a renderable artifact. Keep desktop/mobile rendered appearance and actual keyboard-flow criteria unproved. A screenshot supplied by the user can support only the viewport/state shown; it does not establish interaction behavior.

A supported alternative browser is useful only within authorization and when it exercises the required app/environment. Ask for the narrow missing access only when necessary work depends on it. Do not ask the user to choose irrelevant tooling when another already-authorized surface proves the same behavior.

## Example: smaller repository task

For a parser fix, inspect tests/checks and begin with needed shell/review capabilities; do not provision unrelated UI/provider access.

## Role mapping under limits

Use investigator, implementer and reviewer as responsibilities, not a mandatory headcount. A direct implementer plus one independent reviewer can cover a modest change. A larger contract change may justify separate correctness and structural reviewers; they need the combined artifact rather than independent partial diffs.

When authorized model choices exist, consider actual tool compatibility and context needs before latency. A model unable to read the full affected ownership boundary is a poor fit for integrated review, regardless of its benchmark reputation. Use observed task results to revise mappings; record limits and uncertainty without inventing usage metrics. Reassigning a role also requires reconciling its live ownership and work.

The capability plan should answer: what can run now, what evidence will it produce, what remains unavailable, and what next action resolves the important uncertainty? Store those answers in coordinator state without credentials or unnecessary user data.

## Probe a concrete path, then stop discovery

For a web application, a useful probe may be its existing production build and a local route with isolated test data. It establishes that path under the observed checkout, runtime and configuration. It does not establish authenticated browser access, production credentials or safe load testing. Inspect the scripts and required environment names without printing their values; a failed check should name the missing prerequisite rather than dump configuration.

Distinguish a missing binary, unsupported option, unavailable service, permission rejection and application assertion failure. They require different remedies. An assertion failure is not a missing capability, and installing another tool will not make it passing evidence. An unsupported collector metric stays unverified even if a different metric is available. Do not repeatedly run an identical denied operation without a relevant change or supported alternative.

When a previously working check starts failing after a host, account or checkout change, refresh the affected capability observation. Keep unaffected evidence only when its artifact and dependencies remain valid. Record a supported next action such as obtaining the correct local fixture or using an already authorized compatible runtime; do not silently substitute global settings, provider accounts or a new deployment target.
