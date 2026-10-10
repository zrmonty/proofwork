---
name: typescript-best-practices
description: "Use for TypeScript and TSX changes or reviews; preserve runtime contracts with truthful types and pure domain logic."
---

# TypeScript best practices

Make the runtime contract easy to see and hard to misuse. A convincing type annotation is useful only when the values reaching it obey the same rules.

## Establish the local contract

Read affected callers before changing a signature. Inspect package scripts, the lockfile, compiler version, relevant tsconfig settings, module format, and existing schema/generated types. Identify whether the code runs in a browser, server, worker, or build tool; their APIs and failure behavior differ.

State the invariant concretely: “a retry count is a nonnegative safe integer,” “a completed export always has a download URL,” or “a search result belongs to the latest request.” This is more useful than deciding to make everything stricter.

Read only the detail needed for the task:

- For parsing, numeric/time wire rules, sparse lookups, states, or public signatures, read [Domain contracts](references/domain-contracts.md).
- For promises, bounded work, state checked across await, UI races, modules, resource ownership, or test selection, read [Effects and verification](references/effects-and-verification.md).

## Choose types that expose decisions

Use `unknown` at untrusted entry points and validate before handing values to domain functions. A JSON cast, generated response type, or generic fetch helper cannot establish what the server returned. Reuse the project's validator; a small direct check can suffice for a small contract.

Use a discriminated union when states have different required data. Use ordinary records for data that can coexist. Add a wrapper or brand when it prevents an actual mix-up, with a constructor that establishes its invariant. Branding every string increases ceremony without creating runtime protection.

Let inference describe local values. Annotate public boundaries where the annotation explains promises to callers. Prefer a named concrete type to a chain of conditional types when the domain has one stable shape. Use generics when a relationship between inputs and outputs needs preserving, not to make one implementation appear universal.

Type predicates, assertions, and non-null assertions are proof obligations. Check the producer and every entry path. An assertion for an invariant guaranteed by a framework can be reasonable; an assertion replacing missing validation is a defect.

## Keep decisions pure and effects owned

Pass time, configuration, and decoded data into deterministic functions. Return a decision rather than writing files or updating application state inside a calculation. `readonly` communicates access restrictions; it does not freeze an object or recursively protect nested values. Copy only the levels the operation changes.

A private mutable accumulator or clear loop is acceptable when it preserves caller-owned inputs. Avoid a dense reducer that hides control flow or copies a growing collection at every iteration.

At async boundaries, name the owner of completion, failure, cancellation, and cleanup. Decide whether sibling operations may continue after one fails. Prevent obsolete UI requests from committing results. Cancellation can stop observation without undoing a server-side effect, so retries need the operation's own idempotency policy.

## Verify the claim being made

Run existing compiler and relevant behavior checks. A type check establishes compatibility with that configuration; runtime tests establish selected behavior. Neither substitutes for the other. Exercise malformed input, meaningful boundaries, added state variants, input preservation, and async races when those contracts change.

For a module or published signature change, test an affected consumer or the package build. For TSX, inspect the framework's state and rendering conventions, and verify observable interaction when the change affects the UI.

Return the changed invariant and consumers, actual commands/results, and material gaps. Explain casts, unhandled effects, or public compatibility changes that matter to review. Do not tighten compiler settings, migrate module formats, add dependencies, or rewrite framework architecture as incidental cleanup.
