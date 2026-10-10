---
name: typescript-best-practices
description: For TypeScript changes requiring truthful types and runtime validation.
---

# TypeScript best practices

Match the existing codebase's dominant style before a functional preference. Load functional-programming only for stateful workflows, retries, concurrency, caching or shared mutable state and apply its extraction test; otherwise follow surrounding code.

Inspect affected callers, compiler/configuration, module format, generated schemas and runtime environment. State the invariant the change must preserve before selecting a type.

Use `unknown` at untrusted boundaries and validate runtime values. Casts, generated responses, predicates and non-null assertions carry proof obligations; none replaces missing validation. Prefer concrete public types and local inference. Use discriminated unions for mutually exclusive states and generics only to preserve useful relationships.

Keep clear domain names, deterministic calculations and explicit effect ownership. `readonly` restricts access without freezing nested data. Copy only changed levels; ordinary loops and private accumulators can preserve purity. At async boundaries, identify completion, failure, cancellation and cleanup owners. Reject obsolete UI results and preserve retry/idempotency policy for effects.

Read [implementation contracts](references/implementation-contracts.md) for public signatures, module integration or complex verification. Read [domain contracts](references/domain-contracts.md) for parsing and wire policy, [effects](references/effects-and-verification.md) for async resources and UI races, and [updates and presence](references/patch-and-presence.md) for omitted/null fields and partial updates.

Run existing compiler and relevant behavior checks separately. Exercise changed malformed inputs, state variants, preservation and async races. Public changes need consumer/build evidence; TSX interactions need observable UI verification. Report actual checks and material gaps. Do not add dependencies, migrate modules or tighten unrelated configuration as incidental cleanup.
