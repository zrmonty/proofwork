# Text ownership, units and destinations

## Must

- Must distinguish bytes, Unicode scalars and graphemes.
- Must validate external UTF-8 slicing boundaries.
- Must preserve authoritative protocol and signature bytes.
- Must define normalization, lookup and duplicate identity consistently.
- Must keep platform paths independent of UTF-8 assumptions.
- Must bound rendering expansion and redact diagnostic output.

[&str/String](https://doc.rust-lang.org/std/string/struct.String.html) represent borrowed/owned UTF-8. Choose ownership from retention, not allocation avoidance that keeps a large request alive. Binary/undecoded protocols need bytes first. Lossy decoding changes identity and belongs only to an approximate-display policy. Use [OsStr](https://doc.rust-lang.org/std/ffi/struct.OsStr.html)/[Path](https://doc.rust-lang.org/std/path/struct.Path.html) for non-UTF-8 platform values; never silently drop or rewrite an unrepresentable path.

## Units and boundaries

[str length](https://doc.rust-lang.org/std/primitive.str.html) and offsets count bytes. char counts Unicode scalars; [graphemes](https://unicode.org/reports/tr29/) represent segmentation-defined visible units; rendered width depends on display context. Combining marks/joined emoji differ from scalar counts. Product character limits must name their unit and coexist with transport-byte limits; do not hand-roll segmentation through chars.

char_indices yields byte positions; enumerate over chars yields scalar ordinals. External slicing needs [checked access](https://doc.rust-lang.org/std/primitive.str.html#method.get): UTF-8 boundaries do not necessarily preserve graphemes. Normalization/trimming changes offsets; highlights need mapping or clearly identified representation. Repeated nth-scalar scans can be expensive, but unsafe indexing does not solve the contract.

## Construction and identity

[String addition](https://doc.rust-lang.org/std/string/struct.String.html#impl-Add%3C%26str%3E-for-String) consumes the owned left operand and borrows the right. push_str, formatting or join should follow ownership/output grammar. Private builders are valid; rendering stays separate from logging/persistence/publication. Validate before effects consume partial output.

Reserve only validated reasonable sizes with checked arithmetic and output-expansion budgets. Reused buffers retain capacity and potentially sensitive content. Avoid unnecessary intermediate formats without replacing clear code with obscure buffer manipulation; Clippy is not a benchmark.

[ToString](https://doc.rust-lang.org/std/string/trait.ToString.html) follows Display, may allocate and need not serialize stably. Debug is diagnostic, not stable or secret-safe; deliberately redact sensitive fields. Currency/date/identifier formatting needs explicit locale/unit/canonicalization and any promised Display/FromStr round trip.

[Normalization](https://unicode.org/reports/tr15/) does not establish case-insensitivity or confusable resistance. Preserve authoritative bytes for signatures/audit/protocol identities; separate validated lookup keys when needed. ASCII lowercase, Unicode lowercase and case folding differ. Specify character set/comparison and normalized duplicate disposition; creation, equality/hash and lookup must agree.

## Limits and probes

Bound input bytes before normalization/parsing and output after expansion, including concurrency/retained buffers. UTF-8 validity does not establish destination safety: use existing HTML/JSON/shell/SQL encoding at the specific boundary, not universal sanitization.

Test empty/ASCII/multibyte/combining/joined text as supported, valid/invalid/out-of-range byte positions, retained owned output, separators/empty joins, exact versus lossy decoding, normalized duplicates/original retention and real secret redaction. Measure relevant lengths/expansion before claiming improvements. Library, escaping, benchmark and deployed guarantees remain project-specific evidence.
