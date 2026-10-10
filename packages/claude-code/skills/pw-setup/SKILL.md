---
disable-model-invocation: true
name: pw-setup
description: For explicit host-capability discovery and repository verification setup.
---

# Setup

Establish observed host access and a verification plan sufficient for the task, then begin useful work. Do not inventory irrelevant capabilities or provision tools, credentials, services or tighter configuration incidentally.

## Discover relevant capabilities

Read applicable packaged [runtime](../../adapters/runtime.md), [goal](../../adapters/goal.md), [CLI](../../adapters/control-cli.md) and [UI](../../adapters/control-ui.md) adapters. Inspect project instructions, manifests, locks, toolchains and existing checks; preserve user settings and the incumbent toolchain.

Mark each needed capability supported, unavailable or unknown with its observation. A listed tool permits planning an attempt; successful use establishes actual access. Distinguish shell commands from interactive TUI control, browser connection from authenticated tabs, browser from Electron/native desktop, and delegation from isolated checkouts. Installed libraries do not establish host permission.

Inspect what the first useful command executes and which environment it targets. A command named test may require credentials or mutate remote data. Execute already-authorized local checks; identify consequential effects outside authority rather than treating the command name as permission. Expose the smallest missing prerequisite and continue independent work.

Read [capability and role decisions](references/capabilities.md) for unfamiliar hosts, model choices or partial access failures. Avoid repeated irrelevant probes and credential disclosure.

## Preserve model policy and ownership

For requested role setup, read [model-role configuration](references/model-roles.md), merge repository-local options
and run the read-only planner against observed host inventory. Load
[model patterns](../use-proofwork/references/model-patterns.md) only when alternatives or independent checks justify them.

Keep the configured session model unless the user permits a supported role mapping or fallback. Record requested/actual models where exposed, unknown otherwise. Names in an inventory do not prove dispatch support for this account/session. Report unavailable mappings before dispatch; authorized fallback remains per-invocation unless settings changes are authorized.

Assign roles to uncertainty: investigation, bounded implementation, correctness or maintainability review. A small task can combine roles. Independence requires challenging the actual artifact and assumptions, not selecting a different brand. Where model choice is authorized, use observed relevant performance and actual tool/context, latency and cost constraints.

Native subagents do not provide cross-provider orchestration. This package creates no external bridge; such a bridge would require explicit configuration and credential, isolation, cancellation, validation and usage contracts.

## Map acceptance to evidence

Read [verification isolation](references/verification-isolation.md) when checks touch services, reset fixtures or depend on hidden local inputs. Identify the safe target and owned cleanup before execution.

Select only relevant engineering, language and interface guidance. For each required outcome, name the check/observation, expected environment and missing capability. Builds, unit tests, browser interactions and visual review support different claims; substitute only observations proving the same behavior.

For executable changes, inspect source discovery, separate coverage collection, threshold enforcement and failure-status propagation. Include unimported source through independent inventory; document justified exclusions and any optional project file-size policy. Configured thresholds are not proof that CI runs them.

Missing browser access leaves rendered quality unverified even when code checks pass. An unavailable service leaves its integration criterion unproved; isolated pure checks can still help. Do not weaken acceptance to make the plan green.

Return a concise capability/role/check plan with observed gaps and next actions. Follow native goal rules; setup itself creates no goal, scheduler or deployment. Revisit only capabilities affected by later host, toolchain or assignment changes.
