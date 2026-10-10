# Derives, identity, equality and hashing

Read when adding attributes, copying values, comparing collections or using domain values as keys. A derive is an API and behavior decision; it is not a decoration every type should receive.

## Decide the meaning before the attribute

List what callers should be able to observe, duplicate and compare. Then select the smallest trait set that promises those operations. Deriving Debug, Clone, Copy, PartialEq, Eq and Hash together can expose more than the domain intends.

For a struct, a field-based implementation may fit a plain value object. For a resource owner, identity or handle semantics may require a different contract. Do not derive because a nearby unrelated type does.

Enum comparisons distinguish variants as well as their payloads. Decide whether variants with equal-looking data are actually distinct domain states before relying on automatic comparison.

An attribute can also change compilation, representation or lint behavior. Keep unrelated attributes out of a routine derive change. Do not add broad allow attributes to suppress the useful diagnostic that triggered the review.

Use the [derive reference](https://doc.rust-lang.org/reference/attributes/derive.html) for supported behavior. Third-party derive macros require their own documentation and a boundary review.

## Debug must not leak secrets

Derived Debug exposes field-level diagnostic content. A type containing access tokens, private messages or other sensitive values should not gain that exposure simply to make a test assertion convenient.

Prefer redacted diagnostics that retain safe operational context. Verify the actual formatter for nested wrappers and error chains; redacting one outer field does not establish that every log path is safe.

Do not treat Debug formatting as a stable protocol or persistence format. It is for diagnosis, not an API for extracting fields or comparing production messages.

A failed assertion can print both compared values through Debug. Use harmless fixtures and avoid embedding real credentials in tests. Snapshot tests can also permanently store sensitive output.

For an exported type, changing Debug output can affect diagnostic consumers even when it is not a compatibility guarantee. Search actual log and snapshot uses before changing it.

The [Debug contract](https://doc.rust-lang.org/std/fmt/trait.Debug.html) explains formatting behavior. Security review must inspect where the output goes.

## Copy is a durable promise

Copy permits implicit duplication rather than a move. Derive it only for values whose duplication is semantically ordinary and whose fields support it. Small size is not enough reason to copy a capability or resource identity.

Types with Drop cannot implement Copy. An owning string is not Copy; a shared reference can be copied without duplicating its referent. A mutable reference is not a duplicable exclusive capability.

Adding Copy changes how caller expressions behave. Removing it later can break code that relied on implicit duplication. Treat it as a public commitment rather than a temporary convenience.

For a compact identifier, point or immutable count wrapper, Copy may fit the meaning. A tiny token that is intentionally consumed once may need move semantics even if its storage could otherwise support copying.

Do not convert an owner into a pointer merely to obtain Copy. That changes lifetime, ownership and validity obligations and can introduce a dangling reference or unsafe access.

See [Copy](https://doc.rust-lang.org/std/marker/trait.Copy.html) for the trait's requirements. Use [ownership and domain contracts](ownership-and-domain.md) when deciding whether callers should retain a value.

## Clone must describe what becomes independent

Clone is explicit, but its cost and independence depend on the implementation. Cloning an owned string duplicates its contents; cloning a shared smart pointer generally creates another handle to the same underlying allocation.

Cloning a reference can duplicate the reference rather than its referent. Method resolution and the expected output type matter. Inspect the resulting type before claiming an owned snapshot was created.

A cloned container can still contain shared handles or references. It is not automatically a deep independent copy. State whether later mutation through another owner can affect what the clone observes.

Use borrowing for an observation when ownership need not change. Clone when the consumer needs a retained independent value or shared handle under an explicit contract. Do not clone merely to conceal a borrow conflict.

Generic derived Clone can introduce bounds that a custom implementation might not need. Change to a manual implementation only when a legitimate caller is blocked and the field semantics justify it; avoid boilerplate as a default.

The [Clone contract](https://doc.rust-lang.org/std/clone/trait.Clone.html) defines the trait. Check [Rc cloning](https://doc.rust-lang.org/std/rc/struct.Rc.html#method.clone) or [Arc cloning](https://doc.rust-lang.org/std/sync/struct.Arc.html#method.clone) when sharing is involved.

## PartialEq and Eq have laws

PartialEq models equality that need not be reflexive; floats with NaN are a familiar case. Eq adds the promise that each accepted value equals itself. Eq has no method that automatically verifies this law.

Ordinary equality operators borrow their operands for comparison; comparing non-Copy strings or collections does not inherently consume them. Do not clone both sides just to compare their contents.

Cross-type equality implementations must remain consistent where symmetric or transitive relationships are defined. Avoid ad hoc conversions that make equalities depend on which operand is on the left.

If identity excludes a timestamp or cache field, automatic field comparison may not fit. Choose an explicit identity key or a carefully implemented comparison, then ensure hashing uses the same identity.

Do not use tolerance-based float agreement to implement Eq without proving an equivalence relation. A relation that says A is near B and B is near C while A is not near C violates transitivity.

The [PartialEq laws](https://doc.rust-lang.org/std/cmp/trait.PartialEq.html) and [Eq law](https://doc.rust-lang.org/std/cmp/trait.Eq.html) are obligations for implementors. Numerical input policy belongs in [numeric contracts](numeric-and-float-contracts.md).

## Hash must follow equality

Equal keys must produce equal hash contributions under the same hashing setup. Unequal keys may collide. Tests must not assert that different values always have different hash results.

If equality ignores a field, hashing that field breaks the key contract. A custom equality implementation deserves a paired hash review; deriving Hash independently is not always compatible.

Do not alter a stored key's equality or hash through interior mutability. Remove and reinsert under the collection's contract when identity genuinely changes. Mutable key identity can make lookup behavior inconsistent even without a compiler error.

Hash outputs are not a portable persistence format. Do not store a DefaultHasher result as a stable identifier or use it as a cryptographic digest. Select an explicit documented algorithm for those separate requirements.

When borrowing a lookup key through Borrow, the borrowed form's equality and hash semantics must agree with the owned key. Case-insensitive owned equality with case-sensitive borrowed lookup is not a harmless optimization.

The [Hash contract](https://doc.rust-lang.org/std/hash/trait.Hash.html), [Borrow contract](https://doc.rust-lang.org/std/borrow/trait.Borrow.html) and [HashMap key rules](https://doc.rust-lang.org/std/collections/struct.HashMap.html) define these relationships.

## Collection equality is domain-sensitive

A vector's positional equality answers a different question from a set's membership equality. A map's logical contents differ from its traversal order. Choose the collection whose equality matches the promised meaning.

If duplicates or order matter, replacing a vector with a set changes behavior even when every retained element compares equal. A deduplication pass needs a clear identity policy and an accepted representative-selection rule.

Equality of a collection requires suitable element or key/value comparisons. That does not make comparison cheap: consider the actual size and use pattern before repeatedly comparing large containers.

Non-Copy equality is not a move, but iteration or destructuring performed before the comparison can still consume values. Inspect the complete expression rather than assuming the equality operation caused an ownership error.

For custom ordered keys, Ord, Eq and PartialOrd must agree under their respective contracts. Sorting under one policy and deduplicating under another can silently produce surprising results.

Use [collection documentation](https://doc.rust-lang.org/std/collections/index.html) to select representation; benchmark only when the equality operation is an actual bottleneck.

## Proof checks

Compile a comparison of non-Copy values and then use both values afterward. This catches needless ownership workarounds without asserting how the compiler optimizes comparison.

For custom equality and hashing, test reflexivity where Eq is promised, representative symmetry/transitivity and equal-hash consistency. Property tests can broaden inputs; targeted examples still need the domain's tricky cases.

Test canonicalized identifiers, ignored metadata and alternate accepted spellings if those policies exist. Include lookup through a borrowed key when supported.

Inspect Debug output using harmless synthetic secrets and assert the marker cannot appear through direct, nested or error formatting paths. This is a formatter check, not a complete production logging audit.

For Clone, change an independent owner or shared referent in a controlled fixture and verify the intended observation. Do not report a deep copy when only a handle was duplicated.

Compile a downstream caller for exported derive changes. A passing local test does not establish public trait compatibility or confirm the full numeric and key law space.
