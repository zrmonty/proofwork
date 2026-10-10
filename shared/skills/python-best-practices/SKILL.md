---
name: python-best-practices
description: "Use for Python implementation or review; require strict static typing and explicit ownership, resource lifetime, and error contracts."
---

# Python best practices

Match the existing codebase's dominant style before a functional preference. Load functional-programming only for stateful workflows, retries, concurrency, caching or shared mutable state and apply its extraction test; otherwise follow surrounding code.

Inspect supported interpreters, configuration, imports, dependencies and affected callers. Use compatible APIs and the project's existing tools.

Strict typing is required. Annotate every function/method's parameters and return, including `-> None`; fully parameterize generics and callable contracts. Retain precise inference for locals. Run mypy `--strict`, strict Pyright or the documented equivalent over changed implementation, callers and tests, retaining stronger settings. Missing or failing strict checks leave completion unverified.

Treat untrusted input as `object` and validate before narrowing. Do not propagate unchecked Any, hide bare generics, exclude code to pass, or suppress errors that can be correctly typed. Casts are not runtime validation. Isolate unavoidable untyped integrations in typed adapters.

Use clear domain names and pure decisions with explicit effects. Avoid mutable defaults and implicit globals; copying a frozen record does not establish deep independence. Preserve resource cleanup, exception causes, cancellation and partial-effect policy.

Read [implementation contracts](references/implementation-contracts.md) for detailed ownership and verification. Load [data boundaries](references/data-and-boundaries.md) for decoded data or numeric/time interchange, [effects](references/effects-and-verification.md) for resources and async work, and [typed integrations](references/typed-integrations.md) for SDKs, callbacks, protocols or test doubles.

Report the strict checker configuration, scope and actual result separately from behavior tests. Exercise changed boundary, aliasing, exhaustion or cleanup contracts. Neither annotations nor passing runtime tests prove a strict typing pass.
