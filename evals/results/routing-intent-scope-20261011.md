# Routing intent scope — 0.35.3

Executed on Windows with Node.js 24.16.0. This report describes deterministic classifier and packaging checks,
not native host certification or a permission enforcement boundary.

| Request | Before repair | After repair |
| --- | --- | --- |
| README invoice fix without changing the format | Light/investigate, review-only, no skills | Standard/bug-fix, apply, TDD |
| Implement schema migration without changing public API | Light/investigate; migration floor missing | Full/feature, apply, full floor and TDD |
| Explain how to remove cache and fix stale entries | Standard/bug-fix, apply, TDD | Light/investigate, review-only, no TDD |
| Explain why users must delete old config and add new one | Standard/feature, apply, TDD | Light/investigate, review-only, no TDD |
| Review unused functions, findings only | Light/investigate, no inspection lens | Standard/investigate, review-only, dead-code-audit |
| Audit duplicated validation, findings only | Light/investigate, no inspection lens | Standard/investigate, review-only, dry-audit |
| Compare SQLite/Postgres, findings only | Light/investigate, no architecture lens | Standard/investigate, review-only, architecture-fit |

Three focused tests failed on the reported behavior before production changes. The final focused suite passes
164 tests. It includes genuine mixed explanation/implementation, statement boundaries, preserved migration
floors, plain explanation and mechanical light paths, and natural language/coverage/operational inspections.
Report-only inspections retain their lenses without enabling probe or modifying option workflows.

Independent review caught a qualified-global-prohibition regression in the first candidate. Its regression
failed before correction. The final classifier keeps `do not make any changes to the codebase`, `do not edit
anything until I approve`, `do not edit any files yet` and `without making changes to it` review-only. Scoped
public-API and unrelated-file restrictions still permit the explicitly requested implementation. The reviewer
confirmed these exact probes after repair and found no further material issue within the changed logic.

## Reproduce

```sh
node --test tests/routing-authority.test.mjs tests/router-corpus.test.mjs tests/route-plan.test.mjs tests/workflow-routing.test.mjs tests/named-playbooks.test.mjs
npm run check
npm run build:hooks
node scripts/check-package-parity.mjs
```

The final parity command requires committed generated files. Full checks pass with 2,598/2,627 lines (98.90%)
and 1,660/1,710 branches (97.08%) across 23 first-party scripts. Both standard hosts and optional hooks build.

The corpus grows from 108 to 119 prompts. The original 108 prompts retain exactly 183,556 initial-context
words; the new 11 add 13,646, for 197,202 total. The aggregate allowance adds only the new scenario cost.
Per-task 800/4,000-word light/standard ceilings, 600/800-word entry/reference budgets and the 10% aggregate
rule remain unchanged. No instructional content was enlarged.

## Limits

The router remains a heuristic recommendation. Direct user instructions control authority; matching these
phrases does not prove complete natural-language understanding or agent adherence. Comparative quality,
native lifecycle dispatch and live production behavior remain outside this fixture result. Raw logs, local
checkout paths and temporary artifacts remain local. Cross-platform CI is separate from this Windows result.
