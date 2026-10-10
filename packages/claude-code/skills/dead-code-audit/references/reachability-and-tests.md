# Reachability and test ownership

## Establish what can call the code

Begin with supported execution roots rather than a count of textual references. Read manifests, build inputs, route/command registration and deployment configuration. Follow imports and calls outward from roots, including side-effect imports and generated bindings. A group of mutually referenced helpers with no reachable entry is a candidate for complete removal; deleting one function at a time can leave misleading references and stubs.

For dynamic loading, inspect the actual discovery mechanism: file globs, registry keys, import strings, decorators, naming conventions or reflective lookup. Search both the symbol and its serialized name/path. A plugin file discovered by directory scan may have no direct import. Check supported operating systems, build modes, feature flags and optional integrations before treating the current configuration as complete.

For published packages, exports, CLI options and configuration keys, identify the supported external contract. Repository search cannot see downstream consumers. Retain a supported interface unless compatibility evidence or authorized retirement establishes it can go; do not manufacture a deprecation layer for a private helper that is genuinely dead. If that decision needs user policy, report the candidate while completing independent proven deletions.

Initialization and cleanup are behavior. An imported module may register handlers, install adapters, establish logging or close a resource even when no exported function is called. Check its actual effects before deleting the import. Remove unwanted effects only when their retirement is part of the requested cleanup.

Migrations and historical compatibility paths are evaluated against supported upgrades, restore procedures and the migration tool's identity/checksum rules. Do not delete an applied migration simply because the current application never calls it. Generated source needs the generator/template and regeneration path checked; an apparently unused generated binding may be externally consumed.

## Use a concise candidate ledger

Record: location; responsibility; known roots/consumers; configurations checked; classification; attached tests/artifacts; disposition. This can be a short report for a small task, not a new committed tracking system. Separate lack of evidence from evidence of absence. Tool output supports the trace; it does not replace it.

For example, an internal legacy formatter has only a direct unit-test import after its sole production caller was replaced. Verify no export, string lookup or supported adapter references it. Removing the formatter and its private exact-output test is appropriate. A shared export regression that still checks pagination, ordering and errors must stay even if its old fixture also exercised the formatter.

## Clean tests and artifacts coherently

For every affected test, identify the observable guarantee and remaining implementation that owns it. Remove a file only when all its guarantees belong to the deleted responsibility. When a test contains both old-helper assertions and a live workflow check, remove the obsolete assertions and keep meaningful workflow coverage. Do not move brittle exact implementation checks to the replacement merely to preserve test counts.

Trace fixture/helper consumers across tests, scripts, documentation examples and generated test discovery. A snapshot may belong to another live test; a golden file may encode a public wire contract. Remove test scaffolding only after its final real consumer is gone. Re-run discovery and verify the expected retained tests execute, including configured include/exclude patterns.

Skipped tests and unused fixtures require a reason: a disabled test can describe a required but broken behavior. Keep that unresolved requirement visible instead of deleting the evidence and presenting a clean suite. An unreachable test due to a discovery mistake may need its configuration fixed rather than removal.

## Verification after subtraction

Check the combined deletion for dangling imports, stale registrations, type declarations, documentation examples, package contents and build entry points. Build the artifact that users consume, not only a convenient source subset. Exercise a meaningful surviving success/failure path where initialization or registration changed. Preserve prior failing results and explain whether cleanup affected them.

Update the independently enumerated coverage inventory from actual surviving source. Record removed executable paths and counts; keep the prior inventory/change rationale so the new scope is explainable. A percentage can rise with fewer tested lines: report the new coverage as an observation, not a test-quality improvement. Retain every agreed gate and all surviving relevant source.

Only claim measured runtime, package-size or maintenance savings when actually observed. Deleted line/test counts describe subtraction, not performance or correctness. External consumers, supported environments and runtime paths not exercised remain explicit limitations.
