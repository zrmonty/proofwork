# Conversions and casts

Read when a boundary changes numeric representation, a reference gains unexplained dereferences, type inference fails, or a domain wrapper can be constructed through several routes.

## Decide what the conversion promises

Treat conversion as an interface with an input domain, output meaning, ownership policy and failure channel. Successful compilation establishes that an operation exists; it does not establish that the output preserves the application's meaning.

| Requirement | Suitable mechanism | Review question |
| --- | --- | --- |
| Infallible, meaningful value conversion | `From` / `Into` | Does every accepted source value have an unambiguous valid output? |
| A value conversion can fail | `TryFrom` / `TryInto` | Which input is rejected, and can the caller handle that rejection? |
| Interpret text as a value | `FromStr` / `parse` | Which grammar, units, whitespace and range are accepted? |
| Cheap borrowed access | `AsRef` | Which borrowed view does the caller actually need? |
| Equivalent borrowed lookup identity | `Borrow` | Do equality, ordering and hashing agree across the views? |
| Pointer-like transparent target access | `Deref` | Is this part of the type's intentional public behavior? |
| Language-defined primitive cast | `as` | Is the specified loss or bit interpretation the intended policy? |

Do not convert to a convenient primitive and then assume a domain invariant survived. An ID, count, timestamp and amount can share a representation while requiring different validation.

## From and Into should not hide failure

Implement `From<Source> for Target` for an appropriate infallible conversion; it supplies the corresponding `Into<Target>` implementation. A constructor that can reject a value needs a fallible contract. Panicking inside From for ordinary input turns an apparently total conversion into a runtime trap.

From is for a clear value conversion, not choosing a rounding mode, formatting a number into text or interpreting arbitrary bytes. Use a named operation when several reasonable policies exist. Generic input bounds can accept `Into<Target>` when conversion ownership is appropriate, but concrete helpers need not become generic solely for convenience. See [From](https://doc.rust-lang.org/std/convert/trait.From.html).

For fallible conversion, implement the checked route and retain an informative error. `TryFrom` covers such boundaries as integer narrowing; `TryInto` is its caller-side counterpart. Do not replace a rejected conversion with a default unless the domain explicitly defines that fallback. See [TryFrom](https://doc.rust-lang.org/std/convert/trait.TryFrom.html).

Error conversion should preserve information callers need for recovery. Mapping every rejection to one generic message may be acceptable at a public presentation boundary while still retaining structured causes internally. Avoid logging the original sensitive value merely to make the error more informative.

## Casts express loss, not validation

Integer narrowing through `as` truncates bits. Signed/unsigned casts can change the numerical meaning even when a reverse cast recovers a bit pattern. Float-to-integer casts truncate toward zero and saturate at the destination bounds; NaN becomes zero. Integer-to-float and float-narrowing conversions can lose precision. These are language rules, not policies for trusted prices, lengths or authorization IDs. See [cast semantics](https://doc.rust-lang.org/reference/expressions/operator-expr.html#type-cast-expressions).

For bounded counts, validate the permitted application range as well as representability. A value fitting usize can still request an unacceptable allocation. A valid u64 timestamp may still be outside the application's accepted calendar or retention window.

Use explicit checked arithmetic for intermediate sizes before converting. Multiplication that overflows before a successful narrowing conversion is already incorrect. Saturating and wrapping arithmetic belong only where their semantics are the intended result.

For floating input, decide finite-value and rounding policy before any integer conversion. Reject NaN/infinity where the domain requires a finite quantity. Rust does not provide every imagined numeric pair through TryFrom; inspect the actual available implementation and use a small checked domain operation when needed.

Pointer casts and raw memory reinterpretation have additional safety obligations. They are not a shortcut for parsing or representation conversion. Use the [unsafe/FFI reference](unsafe-ffi-and-invariants.md) if that boundary is genuinely required.

## Borrowed views have distinct contracts

AsRef provides a borrowed view without transferring ownership. It is appropriate for a generic boundary accepting several types with that view; a simple internal function can often accept the reference type directly. Do not add a trait bound without actual caller benefit. See [AsRef](https://doc.rust-lang.org/std/convert/trait.AsRef.html).

Borrow is stronger: the owned and borrowed forms must agree on equality, ordering and hashing relevant to lookup. A case-insensitive key cannot simply Borrow ordinary str if its own equality and hash use case folding while str uses exact content. Such an implementation can make map lookup appear unreliable. See [Borrow](https://doc.rust-lang.org/std/borrow/trait.Borrow.html).

Deref participates in implicit coercion and method resolution. Implement it for a type that intentionally behaves like a pointer to its target, rather than making every domain wrapper expose its representation. Exposing target methods can weaken invariants or create future method conflicts. A named accessor is often the smaller public promise. See [Deref](https://doc.rust-lang.org/std/ops/trait.Deref.html).

## Multiple references are not multiple owned values

A `&&T` can originate from borrowing an existing reference or filtering an iterator of references. Dereferencing once reveals a reference; dereferencing again refers to the underlying value. Moving a non-Copy value out through that borrow remains invalid. Borrow it, explicitly clone the intended value when independence is necessary, or change the original owner contract.

Automatic deref coercion can make an argument fit a borrowed parameter. It does not grant ownership, validate input or extend the lifetime of the underlying object. Preserve explicit lifetime relationships when returning a view.

When a conversion appears to need many stars or clones, inspect the source type and intended target first. Annotate one meaningful intermediate binding if inference obscures that relationship. Do not build a helper chain whose only role is to hide reference levels.

## Parsing has a grammar and a trust boundary

FromStr parses text into a value and has no lifetime parameter for returning a value borrowed from its input. Use a separate borrowed parser interface if that is required. The standard integer parser does not define all of an application's input rules. See [FromStr](https://doc.rust-lang.org/std/str/trait.FromStr.html).

Make whitespace, signs, separators, locale, units, trailing input and empty input explicit. Reject a successfully parsed value when its domain range is invalid. Do not silently trim significant identifier content or accept ambiguous amounts.

Formatting and serialization are distinct: a Display string may be human-friendly without being a stable machine interchange format. If round trips are promised, define and test them; do not infer them from `to_string()` plus `parse()` existing.

## Turbofish and inference should reveal a decision

Use a target binding type when it conveys a useful contract: the collected output type or parsed domain type. Use turbofish to specify a generic target at a call site when that is clearer. Neither mechanism changes runtime validation.

The `::<...>` call-site syntax supplies generic arguments; it does not require specifying every inferred type. Associated functions such as `Target::from` can make a concrete target obvious. Avoid annotating every intermediate solely to make the code look more explicit.

Before resolving an inference error, decide the output representation. Collecting into Vec preserves sequence and duplicates; a set removes duplicates, and a map has a duplicate-key policy. Picking whichever annotation makes the compiler happy can change behavior.

## Proof obligations

- Check the smallest/largest accepted value and one value beyond each relevant boundary.
- Include negative input when the target is unsigned and values around a precision boundary for floating conversions.
- Confirm overflow in intermediate arithmetic is handled before allocation or conversion.
- Check invalid text, trailing input and domain-invalid but syntactically valid text.
- Verify every public construction route establishes the same wrapper invariant.
- Verify equivalent borrowed-key lookup against owned-key lookup, including adversarial normalization cases.
- Compile under the actual MSRV, edition and targets; documentation for a newer standard library is not compatibility evidence.

Record the chosen loss/rejection policy. A cast lint exemption or successful parse is not evidence that the domain decision is correct.
