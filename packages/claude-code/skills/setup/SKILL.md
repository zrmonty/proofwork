---
name: setup
description: Use when first running Proofwork in a repository, changing host or model configuration, or discovering that a required execution capability is missing.
---

# Setup

Establish what this run can actually do. Read the packaged [runtime](../../adapters/runtime.md), [goal](../../adapters/goal.md), [CLI control](../../adapters/control-cli.md) and [UI control](../../adapters/control-ui.md). Inspect applicable project instructions, manifests, lockfiles, toolchain versions and existing verification commands. Do not install tools, tighten configuration or change credentials as incidental setup.

Report supported, unavailable or unknown for shell execution, interactive TUI, browser interaction/capture, Electron/native desktop, subagents, worktree isolation, native goal and model selection. Installed libraries do not prove host access. Distinguish a browser connection from access to the user's authenticated sessions.

Map coordinator, investigator, implementer, correctness reviewer and maintainability reviewer to explicitly configured supported models. Otherwise retain the user's current settings. Record requested versus actual model when exposed, unknown otherwise. A missing requested model is disclosed before dispatch. Use a fallback only within the user's policy; do not silently substitute. Mixed providers require an explicit bridge with credentials, isolation, cancellation, validated output and usage reporting; native subagents alone do not supply it.

Select language skills for actual affected files, shared principles for workers, and frontend-design for interface work. Record existing checks and required evidence against acceptance criteria. If a capability is absent, identify the exact unproved criterion and a supported substitute when it proves the same behavior. Continue independent useful checks; do not claim completion with missing required evidence. Output a concise capability/role/check plan in the coordinator checkpoint. Setup itself creates no goal, performs no deployment and launches no background service.
