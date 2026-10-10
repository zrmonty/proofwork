# Clear Voice specification

## Purpose and trigger

Apply during engineering documentation, code comments and delivery reports, including instructions written for
other agents. Improve comprehension without changing the technical claim. Interface wording remains the Humanizer
skill's responsibility; shared prose principles can apply without requiring both full workflows.

## Decisions and constraints

- Identify the audience, intended action and supplied facts before editing.
- Replace unsupported intensifiers with observed specifics or deletion. Keep meaningful technical vocabulary.
- Remove repetition and decorative rhetorical patterns when they obstruct understanding. Preserve useful headings
  and parallel structure rather than banning them mechanically.
- Preserve literal commands, identifiers, quotations, measurements, units, provenance and safety consequences.
- Keep requested, observed, inferred and unverified outcomes distinct. Missing checks cannot become implied success.
- Explain a necessary term at the point where it affects the reader's decision. Do not simplify away an invariant.
- Editing prose alone does not authorize changing code behavior or renaming public symbols.

## Observable acceptance cases

1. “Massively improved performance” becomes a measured comparison with its environment, or a narrower statement
   when no comparable benchmark exists.
2. A repetitive three-part slogan becomes a direct instruction while a useful three-column comparison survives.
3. An exact CLI argument, checksum, quoted error and numeric tolerance remain unchanged during a prose revision.
4. An unrun browser check remains explicitly unrun instead of becoming “the experience is polished.”
5. A specialist document retains a necessary ownership term and explains its consequence where needed.
6. Formal instructions stay appropriately formal; simplification does not impose jokes, slang or promotional tone.

## Verification

Compare the revision with the source facts and literal strings. Assess clarity in the intended reading context.
Prose inspection supports an editorial judgment; it does not establish user satisfaction or behavioral correctness.
The [worked report example](../report-worked-example.md) illustrates an honest revision without claiming execution.
