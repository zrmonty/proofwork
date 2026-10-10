---
name: setup
description: Establish Proofwork's actual host capabilities, supported model roles and project verification plan when starting in an unfamiliar repository or encountering a missing capability.
---

# Setup

Replace assumptions about the environment with a short plan grounded in observed access. Setup should expose what can be proved, then let useful work begin. It does not need to inventory irrelevant capabilities for a small task.

## Discover what the task needs

Read the packaged [runtime](../../adapters/runtime.md), [goal](../../adapters/goal.md), [CLI](../../adapters/control-cli.md) and [UI](../../adapters/control-ui.md) adapters as applicable. Inspect project instructions, manifests, lockfiles, toolchain versions and existing checks. Preserve the project's toolchain and user settings. Do not install tools, change credentials, launch services or tighten configuration as incidental discovery.

Mark relevant capabilities **supported**, **unavailable** or **unknown**, with the observation behind the label. A listed tool can support a planned attempt; successful use establishes what access works in this environment. Distinguish ordinary shell execution from interactive TUI input, browser connection from authenticated tab access, browser from Electron/native desktop, and delegation from isolated checkout support. A library on disk does not establish any of those host permissions.

Make the first useful check reproduce the project's actual path rather than certify the whole machine. Inspect what its command invokes, which environment it targets and whether fixtures are isolated before executing it. A command named test can still require live credentials or modify remote data. Use existing authorization for the intended local checks; identify a consequential effect that falls outside it instead of treating a script name as permission. Report the smallest missing prerequisite, not a demand to provision every possible tool.

For unfamiliar hosts, model choices or partial capability failures, read [capability and role decisions](references/capabilities.md). Do not repeatedly probe irrelevant access or expose credentials to establish a status.

## Choose roles without changing model policy

Retain the user's configured session model unless an explicit role mapping or fallback policy permits another supported model. Record requested and actual model where exposed, unknown otherwise. Capability and model support can differ between surfaces or accounts; a model name in an inventory does not prove this session can dispatch it.

Choose a role for the uncertainty being resolved. An investigator traces a failing rule; an implementer owns a bounded change; a correctness reviewer challenges behavior; a maintainability reviewer challenges the model and ownership. A simple task can combine roles. Independence comes from reviewing the artifact and assumptions, not merely selecting a different model.

Where model choice is authorized, use observed performance on the relevant task, required context/tool support, latency and supplied cost limits. Do not assign strengths by brand or promise a quality improvement without evidence. An unavailable requested model is a disclosed gap before dispatch. A fallback is used only within the user's policy and remains per-invocation unless settings changes are authorized.

Native subagents do not supply cross-provider orchestration. An external bridge would need explicit configuration, credential handling, isolation, cancellation, output validation and usage visibility; this package does not create one.

## Map checks to acceptance

Read [verification prerequisites and isolation](references/verification-isolation.md) when commands touch services, reset fixtures or depend on hidden local inputs. Establish the safe target and owned cleanup before execution, without incidental provisioning.

Select shared engineering skills, languages for affected files and frontend guidance for interface work. For each required outcome, name the existing check or observation that can prove it, its expected environment, and any missing capability. Treat builds, unit tests, browser interactions and visual review as different claims. A supported substitute is acceptable only when it proves the same required behavior.

For executable work, inspect both collection and enforcement: source discovery, separate coverage metrics, failure-status propagation and code-file discovery. A threshold in configuration is not evidence that CI runs it. Record how unimported source and ignored/custom generated code enter the respective inventories.

If browser access is absent for a layout task, code checks can continue but cannot establish rendered quality. If a project test requires an unavailable external service, isolate pure behavior where useful and keep the service-backed criterion unproved. Do not weaken acceptance merely to make the plan pass.

Return a concise capability/role/check plan to the coordinator checkpoint, including specific gaps and the smallest next action. Follow the live host's native goal rules; setup creates no goal, scheduler or deployment. Revisit only the capabilities affected by a later host, toolchain or assignment change.
