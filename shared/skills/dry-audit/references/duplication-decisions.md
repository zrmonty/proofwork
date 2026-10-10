# Duplication decisions

## Same knowledge or coincidental shape?

Two price calculations for the same invoice policy should agree on units, rounding, tax inputs and errors. If they independently encode that policy, choose one pure domain function and migrate both callers. Preserve calculation order; algebraically similar floating-point operations need not produce the same value. A subscription estimate and a settled invoice may instead follow different rounding or disclosure rules: identical syntax today does not establish one shared policy.

Ask what real requirement would make each copy change. If the answer differs, sharing can turn independent policies into a growing set of switches. If the answer is the same, locate the owner that can express it without importing a concrete UI/network adapter into domain code. Use a small concrete function before a generic strategy framework.

## Validation and enforcement

A client checks quantity to give immediate feedback; the server checks it because its input is untrusted. These are separate enforcement points. Where semantics genuinely match, share a schema or pure validation rule through existing project mechanisms, but keep both boundary calls. A cross-language wire contract may require parallel typed implementations and a shared contract fixture rather than a new code-generation toolchain.

Authorization is checked for the current actor/resource/action at the real effect boundary. Sharing the permission rule cannot make a stale client decision authoritative. Consolidate duplicated policy without removing the necessary check or transaction that makes it truthful.

## Effects and mutable state

Two loaders can share a decoding calculation while retaining different timeout, cleanup and error contracts. Do not extract a generic loader that loses cancellation ownership or catches every error as empty success. Repeated retry code may encode different idempotency guarantees; establish those guarantees before sharing.

Prefer immutable shared tables for stable domain facts. Keep caches/configuration with an explicit owner and lifetime; one global mutable object can couple tenants, tests or requests. A pure transition can express shared state rules while adapters preserve distinct storage commits. Structural sharing must not expose caller-owned mutable nested values.

## Tests and intentional repetition

Repeated setup can be a small typed fixture when it obscures the behavior, but keep important inputs visible in the test that owns them. Do not create a fixture DSL for a few literals. Tests of the shared calculation protect domain alternatives; consumer tests protect wiring and boundary enforcement. They are complementary even when expected values match.

Remove an obsolete copy's private implementation assertions after its consumer uses the authoritative rule. Keep unique failure detectors and meaningful public compatibility checks. Similar production/test formulas can hide a shared mistake; compute an independent expected result rather than importing the calculation as its own oracle.

Generated language bindings and published contract literals may deliberately repeat values. Change their source and regenerate when appropriate, retaining compatibility checks. Documentation examples can repeat enough context to remain understandable; moving every phrase to one location is not a code-maintenance improvement.
