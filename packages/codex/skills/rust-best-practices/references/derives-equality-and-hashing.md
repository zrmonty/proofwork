# Derives are public contracts

Choose only the observation, duplication and comparison promises the domain needs. Field-based derives suit some values, not necessarily resource identity or capabilities. Enum equality includes variants/payloads. Representation, cfg and lint attributes are separate decisions; broad allow attributes must not hide the triggering diagnostic. Check [derive behavior](https://doc.rust-lang.org/reference/attributes/derive.html) and third-party macro contracts.

## Disclosure and duplication

[Debug](https://doc.rust-lang.org/std/fmt/trait.Debug.html) is diagnostic, not stable serialization or secret-safe output. Derived/nested formatters and error chains can disclose fields; failed assertions and snapshots can store both compared values. Use harmless synthetic secrets, deliberate redaction, and inspect actual consumers before changing formats.

Copy/Clone ownership, reference layers and independence are canonical in [copy semantics](copy-clone-and-reference-depth.md). Derives are durable caller commitments: removing Copy or adding generic Clone bounds can break legitimate consumers. Manual Clone is justified only when actual field semantics permit a less restrictive contract, not as routine boilerplate. Pointers must not replace owners merely to obtain Copy.

## Equality, order and hashing

[PartialEq](https://doc.rust-lang.org/std/cmp/trait.PartialEq.html) allows non-reflexive values; [Eq](https://doc.rust-lang.org/std/cmp/trait.Eq.html) promises reflexivity without checking it automatically. Ordinary equality borrows non-Copy operands, so copying strings solely for comparison is unnecessary. Defined cross-type relationships must remain symmetric/transitive where required. Ignored metadata needs an explicit identity policy. Approximate float tolerance generally cannot supply transitive key equality; use [numeric contracts](numeric-and-float-contracts.md).

[Hash](https://doc.rust-lang.org/std/hash/trait.Hash.html) must agree with equality: equal keys hash equally; unequal keys may collide. Do not hash an equality-ignored field or require distinct hashes for every unequal pair. Stored key identity must not change through interior mutation. Hash output is neither portable persistence nor cryptographic identity. Borrowed lookup identity and representatives are covered in [map/set laws](maps-sets-and-key-laws.md).

Vector positional equality, set membership and map logical contents differ. Replacing a vector with a set changes order/duplicate semantics. Ord, Eq and PartialOrd must agree for ordered keys; sorting and deduplicating under different identity rules can surprise consumers. Comparison itself may be expensive, and earlier destructuring can move values even when equality does not.

Compile non-Copy comparisons followed by reuse. For custom traits probe reflexivity where promised, symmetry/transitivity, equal hashes, normalization, ignored metadata and borrowed lookup. Check Clone independence/shared observation and Debug redaction through direct/nested/error paths. Compile affected downstream consumers for exported derive changes. Property testing broadens observations, not proof of every numeric/key law or production logging path.
