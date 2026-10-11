# Routing authority and package parity — 0.35.2

Executed locally on Windows with Node.js 24.16.0. These are deterministic routing and Git checkout fixtures;
they do not certify native host behavior or establish a permission enforcement boundary.

## Regressions

| Contract | Before repair | After repair |
| --- | --- | --- |
| Natural no-change audit instructions | `teamPolicy.mode` was `apply` | `review-only`; includes findings-only, straight/curly apostrophes and without-editing cases |
| Explanation followed by explicit implementation | Investigation/light; testing and migration floor missing | Migration is feature/full with TDD; explain-then-fix is bug-fix/standard with TDD |
| Named report-only procedures | Investigation/light with inspection skills missing | Requested stage/full floor and analytical skills retained; policy remains review-only |
| Newly generated package references | `git diff --exit-code` returned 0 for two untracked host reference files | Actual CI command exits 1 and reports both untracked references |

Four focused regression tests failed on unmet assertions before production changes. After repair, the focused
routing/parity suite passes 145 tests. The existing mixed review-and-fix stage remains review, with verification
preserved. Explanation-only and explicit no-edit requests do not acquire repair authority. Report-only audits
can load TDD as a coverage inspection lens; that skill explicitly forbids authoring tests without authority.

The Git fixture also checks staged, modified and deleted package files, marketplace differences, unrelated
working files and a non-Git directory. The parity checker is read-only and fails closed on Git inspection errors.

## Reproduction

```sh
node --test tests/routing-authority.test.mjs tests/package-parity.test.mjs tests/router-corpus.test.mjs tests/route-plan.test.mjs tests/workflow-routing.test.mjs
npm run check
npm run build:hooks
node scripts/check-package-parity.mjs
```

The final parity command expects a committed generated tree; staged package changes deliberately fail it.
`npm run check` passes source-width checks, context budgets, full-suite coverage and both standard host builds.
Coverage is 2,568/2,597 lines and 1,640/1,690 branches across 23 first-party scripts. Optional hook builds pass.

The routing corpus grows from 94 to 108 prompts. Added scenarios contribute 17,486 initial-context words;
the aggregate budget adds exactly that amount to its prior 155,239-word allowance. Existing per-task ceilings
(800 light / 4,000 standard), entry/reference budgets and the 10% aggregate growth rule stay unchanged.
Current aggregate usage is 183,556 words; the previous 94 scenarios use 166,070. No skill content was enlarged.

## Limits

Routing is a heuristic recommendation. User instructions govern authority regardless of classifier output;
these tests do not prove that an agent obeyed a live read-only request. Local fixture checks do not certify
Claude/Codex hook dispatch, production security or comparative agent quality. Cross-platform CI is separate
from this local result. Raw test logs and checkout paths remain local.
