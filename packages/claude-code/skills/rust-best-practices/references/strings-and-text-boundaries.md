# Strings and text boundaries

Read when text allocation, concatenation, Unicode slicing, display formatting or normalization changes data meaning.

## Choose a representation by responsibility

Use `&str` for borrowed valid UTF-8 text and String for owned growable UTF-8 text. A borrowed view can avoid a copy but retains its source lifetime. Small owned output can be simpler than returning a view that retains a large request buffer. See [String ownership and storage](https://doc.rust-lang.org/std/string/struct.String.html).

Use bytes when the protocol is binary or text validity has not yet been established. Validate decoding at the boundary. Lossy decoding replaces invalid input and therefore changes the value; it is appropriate for an explicitly approximate display, not automatically for identifiers, signatures or exact import records.

OS paths and environment values need the platform-aware types where arbitrary platform text is possible. A path that cannot be represented as UTF-8 must not silently disappear or become a different path. See [OsStr](https://doc.rust-lang.org/std/ffi/struct.OsStr.html) and [Path](https://doc.rust-lang.org/std/path/struct.Path.html).

Avoid unnecessary String conversions in internal helpers that only inspect text. Allocate at the point where independent ownership is required. A generic text bound should serve real callers; ordinary `&str` is often sufficient.

## Length must name its unit

| Unit | What it measures | Typical use |
| --- | --- | --- |
| UTF-8 bytes | Encoded storage or transport size | Request limits, buffer sizes, byte-oriented protocol offsets. |
| Unicode scalar values | Rust char values | Scalar-oriented processing with an explicit Unicode contract. |
| Extended grapheme clusters | User-perceived text units according to segmentation rules | Editing and visible-character policies. |
| Rendered width | Display space under a renderer/font/terminal policy | Truncation to a visual region. |

Rust str length and indexing offsets use bytes. A char is not an arbitrary visible character. Combining marks and joined emoji can make several scalars form one grapheme. Display width is another measurement and may depend on context. See [str](https://doc.rust-lang.org/std/primitive.str.html) and [Unicode segmentation](https://unicode.org/reports/tr29/).

Do not label a byte limit as a character limit in product copy. Enforce the transport budget independently even when a visible-character limit also exists. Human-facing requirements may justify a maintained Unicode-aware dependency; do not hand-roll segmentation by splitting on chars.

## Slice only at valid boundaries

An offset from `char_indices()` is a byte position into the source string. An ordinal produced by enumerate over chars is a scalar counter. They are not interchangeable.

Direct string slicing can panic for out-of-range or non-character-boundary byte offsets. For external offsets, use checked access and return a meaningful rejection. A successful boundary check establishes a valid UTF-8 slice, not that the cut preserves a grapheme or the user's intended text. See [checked string access](https://doc.rust-lang.org/std/primitive.str.html#method.get).

Specify whether offsets refer to the original text or a transformed version. Trimming, normalization and case changes can alter positions. Error highlights must preserve a mapping or report positions in the actual representation they inspect.

For repeatedly selecting the nth scalar, repeated scans can become expensive. Choose a representation or traversal suited to the measured access pattern. Do not introduce unsafe indexing to avoid understanding UTF-8.

## Concatenation has an ownership and allocation policy

Adding a borrowed string to an owned String consumes the left-hand owner and produces the resulting String; the borrowed right-hand text remains borrowed during the operation. This is not symmetric String-plus-String arithmetic. Use the form that makes caller ownership clear. See [String addition](https://doc.rust-lang.org/std/string/struct.String.html#impl-Add%3C%26str%3E-for-String).

Appending with push_str updates an owned builder. Formatting constructs text according to the formatting contract. Joining a sequence can express separators more clearly than a loop with trailing-separator repair. Choose from the output grammar and ownership requirements, then measure if allocation is material.

A private mutable String builder inside a pure rendering function is acceptable. Keep rendering separate from publication, persistence or logging. If rendering can fail because data is invalid, validate or return an error before effects consume a partial result.

Reserve capacity only from validated reasonable size information. Account for arithmetic overflow in total byte estimates and enforce an output budget when untrusted input can expand. Reusing a buffer can retain sensitive content and large capacity; its lifecycle and cleanup belong to an explicit owner.

Avoid formatting intermediate strings merely to concatenate them again. Conversely, avoid obscure buffer manipulation when one straightforward format call is adequate. A Clippy suggestion is a prompt to inspect the contract, not an independent benchmark result.

## Display is human communication, not a wire format

Implement Display for the intended human-readable representation; ToString is supplied for Display types. Calling `to_string()` can therefore allocate and can produce domain-formatted text rather than a serialization format. See [ToString](https://doc.rust-lang.org/std/string/trait.ToString.html).

Debug is diagnostic output. It is not a stable public message or a secret-safe representation. Derived Debug can expose every included field; use deliberate redaction for credentials, tokens and sensitive records before data reaches logs or error reports.

Do not rely on a Display/FromStr round trip unless that relationship is specified and checked. User-readable currency, dates and identifiers can have locale, unit or canonicalization requirements that a generic formatter does not establish.

## Normalization is a domain choice

Unicode-normalized forms can represent text equivalences useful for some comparisons. Normalization does not imply case-insensitivity, confusable resistance or an appropriate policy for every identifier. Pick the required normalization form and define when it applies. See [Unicode normalization forms](https://unicode.org/reports/tr15/).

Preserve exact original bytes when signatures, audit records or external protocol identities require them. Store a separate validated lookup key when user-facing matching needs normalization; do not silently rewrite the authoritative value.

Case-insensitive comparison needs a specific rule. ASCII-only lowering may be correct for a restricted protocol token and wrong for arbitrary human text. Unicode lowercase conversion is not automatically the same policy as case folding. State the accepted character set and comparison contract.

For keys, apply the same normalization and equality/hash policy to creation and lookup. Duplicates that arise after normalization need an explicit reject, merge or replacement decision. Do not let whichever record was inserted last decide identity accidentally.

## Bound text processing before expensive work

Validate input byte budgets before normalization, parsing or constructing many substrings. Bound derived output as well: escaping or expansion can make output larger than input. Account for concurrency and retained buffers when selecting limits.

UTF-8 validity alone does not make text suitable for a destination. Escape or encode at the HTML, JSON, shell or SQL boundary using the existing safe mechanism. Do not sanitize text once and assume it is safe in every context.

Pure text functions should return values and structured failures. Keep authority-sensitive writes and outbound messages at the effect boundary, after destination-specific validation. This preserves the ability to test transformations without publishing real user content.

## Proof obligations

- Cover empty text, ASCII, a multibyte scalar, combining marks and a joined emoji when the product supports them.
- Check exact byte boundaries, one invalid internal byte boundary and out-of-range offsets.
- Verify output ownership when it must outlive the input.
- Verify separators and empty elements for joins or concatenation.
- Reject invalid decoding where exact data is required; test lossy display separately when permitted.
- Check normalized duplicates, original-value retention and lookup agreement.
- Confirm diagnostic formatting redacts actual secret-bearing fields.
- Measure representative byte lengths and expansion when claiming allocation or processing improvements.

These are contracts to verify in the consuming project. This reference does not certify a particular Unicode library version, escaping implementation, benchmark or deployed application.
