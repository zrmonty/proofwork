# Contemporary flow references — 0.37.2

Executed October 15, 2026. The humanizer now prefers contemporary examples for multi-sentence application
copy. Classic novels remain optional rhythm comparisons. Both sets are conditional references; simple
controls do not require an example-reading exercise.

## Sources and reuse

Four source excerpts total 82 words, with original explanation of their sentence relationships:

- GitHub Docs and contributors: definition followed by use, 24 words, CC BY 4.0.
- The Carpentries and contributors: mechanism followed by supported benefit, 25 words, CC BY 4.0.
- Nicky Case, The Evolution of Trust (2017): concrete situation followed by an actual choice, 16 words, CC0.
- Government Digital Service, Cookies on GOV.UK: situation followed by available control, 17 words, OGL v3.0.

The first three source texts and license notices were fetched at the immutable GitHub revisions linked
in the reference. Their quotations were matched after stripping markup and normalizing whitespace.
GOV.UK's publisher page was checked on the execution date, including its quoted wording and OGL footer;
it is access-dated rather than revision-pinned. The separate National Archives license endpoint returned
403 to the browser; the publisher's license declaration was available. Attribution and original license
links appear beside each excerpt and in NOTICE. No code, audio, logos or other source assets were copied.

## Executed checks

- `npm run context-budget`: passes, 34 skills and 119 route scenarios. Aggregate initial context is
  203,370 words, up 180 from 203,190, within the unchanged allowance. The new reference is 608 words,
  below the existing 800-word limit.
- `npm run build`: passes; both Codex and Claude Code packages contain the new reference and notice.
- `node --test tests/build.test.mjs tests/adapters.test.mjs tests/skill-list.test.mjs`: ten tests pass,
  none skipped. Package reference/link validation is included.
- `npm run build:hooks`: passes for the optional hook distribution.
- Generated package parity is checked separately after committing the regenerated files.

## Limits

These are selected examples, not a representative corpus or model training. Guidance transfers sentence
relationships to supplied product facts; it does not transfer cookie rules, performance promises, playful
narrators or author personalities. An authored acceptance scenario covers contemporary register and fact
preservation; no fresh-model, reader-study, rendered UI, localization or detector evaluation was executed.
The full runtime coverage suite was not rerun for this reference-only change. The previously reported
Windows/Node 24 instrumented-test issue remains unresolved and is not claimed as repaired.
