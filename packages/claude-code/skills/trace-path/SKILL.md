---
name: trace-path
description: For explaining execution paths, data ownership and subsystem boundaries.
---

# Trace path

Start with the requested action, entrypoint or symbol. Inspect its relevant callers and selected configuration; build a small mental model before changing it. Name mutable owners and effect boundaries.

Return a concise path map with file/symbol pointers, responsibility changes and unresolved edges. Separate inspected behavior, executed observations and inference. Remain read-only unless edits are authorized; stop once the mechanism is understandable.

Read [flow details](references/flow-details.md) for substantial tracing or paths crossing subsystem, persistence or external-service boundaries.
