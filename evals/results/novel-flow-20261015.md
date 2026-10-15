# Novel flow references — 0.37.1

Executed October 15, 2026. The humanizer now conditionally links one 774-word reference with four short
novel excerpts and original analysis of information flow. This is a reference/content change, not an
application rewrite or a runtime change.

## Source verification

Each entry identifies author, title, publication year, chapter, immutable source revision and edition notice:

- Jane Austen, Pride and Prejudice: conversational question, reply and source of information.
- Charles Dickens, Great Expectations: a reason followed by its consequence, retaining the referent.
- Mark Twain, The Adventures of Tom Sawyer: concrete action and a reaction to the same scene.
- Willa Cather, My Antonia: selective detail changes explanatory pace and establishes voice.

The final Markdown quotes were compared directly with parsed XHTML from all four pinned GitHub revisions.
All excerpts match their source substrings: 47, 37, 32 and 54 words, totaling 170. Edition notices were
fetched at those revisions and checked for their U.S. public-domain statement and CC0 contribution notice.
The reference and NOTICE distinguish quoted text from Proofwork-authored commentary and avoid a blanket
worldwide underlying-rights claim. Inline emphasis and annotations are not reproduced; punctuation and
selected paragraph breaks are retained.

## Executed checks

`npm run context-budget`, `npm run build` and the focused suite pass:

```sh
node --test tests/build.test.mjs tests/adapters.test.mjs tests/skill-list.test.mjs
```

All ten tests pass without skips. Both hosts contain the reference and revised attribution notice.
Optional-hook builds also pass. Generated parity is checked against the committed package tree.

Aggregate initial context rises from 202,794 to 203,190 words (396 words) within the unchanged allowance.
Light/standard maxima are 672/3,210, below 800/4,000. There are still 34 skills and 119 route scenarios;
the 774-word conditional reference is below the existing 800-word reference ceiling.

## Limits

The examples illustrate selected literary techniques, not a statistical standard for everyday language.
They are optional for multi-sentence flow; standalone controls do not require literary reading. Guidance
prohibits importing fictional memories, archaic register or narrative delay into interface state/recovery.
No fresh-model, reader-study, rendered UI, translation or authorship-detector evaluation was executed.
The full runtime coverage suite was not rerun for this reference-only change. The previously reported
Windows/Node 24 instrumented-run failure remains outside this change and is not claimed as repaired.
