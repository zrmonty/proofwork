# Domain models and examples

Use this reference when a behavior depends on several meanings hidden in the same field or when data crosses a boundary.

## Distinguish meanings before choosing types

A report row with an optional amount could mean “not reported,” “not applicable,” or “failed to parse.” Converting each to zero creates a plausible but false total. Decide whether the output needs a value, an explicit status, or a validation error. Keep the representation simple while preserving distinctions that affect the user's decision.

An identifier is not a quantity. A formatted label is not a stable identity. A timestamp needs an interpretation and precision; a monetary value needs a currency and numeric policy. Use the domain's existing conventions and avoid guessing those policies from a convenient language type.

For each changed invariant, keep one concrete example and a counterexample:

| Invariant | Representative example | Revealing counterexample |
| --- | --- | --- |
| Export preserves order and all pages | Three known pages remain in the same order | Last page omitted, duplicate page inserted |
| Unknown amount stays unknown | Missing observation shown as unavailable | Missing converted to zero and included in mean |
| State has one owner | One writer applies a versioned transition | Two writers overwrite each other's updates |
| Boundary rejects malformed input | Invalid record gets contextual error | Invalid record silently becomes an empty success |

These examples identify checks; they do not prescribe a universal schema.

## Data-driven rules without an interpreter

A stable status-to-label mapping may be clearer as a small table than repeated conditionals. A rule that depends on authorization, ordering, effects, or error recovery may be clearer as explicit code. Do not hide such rules in string expressions or a generic “policy engine” just because it can be represented as data.

Store domain facts once where their owner is clear. Keep derived values derived when recomputation is safe and inexpensive. If persisting a derived value is necessary, define how it stays consistent and how stale data is detected.

## Interchange contract

Read both producer and consumer. Verify the exact serialized representation with a representative successful value and a meaningful malformed/edge value. Check absence versus null, units, enum spelling, ordering, unknown fields, and compatibility only where they matter to the changed contract.

A TypeScript type, Python annotation, and Rust struct may look equivalent and still encode different wire values. An end-to-end contract check answers the actual question; adding three unit tests of local construction does not.
