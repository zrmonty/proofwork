---
name: typescript-best-practices
description: "Use for TypeScript and TSX changes or reviews; preserve runtime contracts with truthful types and pure domain logic."
---

# TypeScript best practices

## Inputs
Inspect affected callers, package scripts, tsconfig, lint rules, framework conventions, and any schema or generated types that already define the contract.

## Workflow
1. Separate external decoding from typed domain operations. Treat untrusted input as unknown until actual runtime checks establish its fields and invariants. Use the existing schema validator when present.
2. Represent mutually exclusive states as distinct variants with a discriminant. Check all variants when adding or changing one. Required data belongs on the relevant variant rather than scattered optional properties.
3. Reuse authoritative types where that preserves meaning. Add domain distinctions when they prevent a demonstrated mix-up. Let inference handle local expressions; annotate public contracts and places where inference obscures intent.
4. Prefer pure calculations with explicit dependencies and readonly input contracts where useful. Readonly is not a runtime freeze and does not promise deep immutability. Avoid modifying shared arrays or objects.
5. Use narrowing that matches runtime truth. Assertions and custom predicates need a defensible invariant; do not silence an invalid parse with a cast. Check numeric ranges and null/empty cases separately from shape.
6. Keep promises, error handling, abort behavior, and resource cleanup explicit at async boundaries. Do not detach a promise without an owner for failures.
7. Run the repository's relevant type/lint checks and behavior tests. Verify serialization or UI flows when the changed contract crosses those boundaries.

## Outputs
Return the changed contract, affected consumers, actual check results, and any casts or mutation whose necessity matters to review.

## Boundaries
Do not tighten compiler settings, add a schema library, or convert framework architecture as incidental cleanup. Compile success cannot prove external data valid. Load functional-programming for a new domain/state design.

## References
Consult the installed compiler's applicable behavior; these official references are technical grounding, not imported skill instructions.
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Object types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Type manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## Behavioral cases
Malformed JSON fails at entry; adding a job state exposes missing handling; pure transforms leave inputs intact; existing checks remain configured. See language-scenarios.
