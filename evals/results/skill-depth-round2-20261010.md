# Second full skill-depth review — 0.7.0

All seventeen canonical skills, their conditional references and corresponding specifications were reviewed and strengthened. The objective was better decisions and stronger evidence, rather than additional length. Both host packages are generated from the canonical source; no new runtime dependency or command was added.

## What changed

| Skills | Decisions strengthened |
| --- | --- |
| use-proofwork, worker-mode, setup | Acceptance describes user outcomes; workers surface semantic dependencies and hypotheses that can be disproved. Integrated changes invalidate affected evidence. Recovery reconciles unknown external effects and changed inputs. Setup distinguishes unavailable tools from failed assertions and checks actual collection and enforcement. |
| architecture-fit, clean-code, thermo-nuclear-code-quality-review | Challenge every consequential component, including whether to omit it. Walk complete actions and failures before accepting boundaries. Count hidden coordination costs. Split files along responsibilities while preserving initialization, identity and resource ownership. Reviews compare scoped remedies and allow a clean verdict. |
| TypeScript, Rust, Python, functional-programming | Preserve numeric and time semantics, caller ownership and operation ordering. Address shared mutable values across suspension, cancellation and blocking work, UTF-8 boundaries, permissive JSON parsing, exact decimal construction and cache dependencies where relevant. |
| data-driven-development, performance-increase | Distinguish assignment and measurement units, interference and leakage. Preserve failed attempts, workload distributions and resource costs. Separate exploratory tuning from independent confirmation; investigate growth, skew and small-input crossover. |
| tdd-95 | Preserve separate line and branch gates, independent executable-source inventory and dirty-tree identity. Merge shard opportunities by identity rather than summing duplicates. Ensure async assertions execute and fixtures do not hide ordering or teardown failures. Consolidation retains distinct fault detectors. |
| frontend-design, humanizer | Reconcile stale selection, changed permissions, partial success and unknown outcomes. Copy follows actual backend capabilities and allowed disclosure. Content, localization and accessibility stress cases are conditional; visual claims still require rendered evidence. |
| production-finish, commit-features | Verify mixed-version cutover, schema/configuration compatibility and recovery state. Promote the tested artifact and distinguish packaging from live readiness. Check staged versus tested content, hook changes, remote movement and per-ref delivery results. |

The functional default, active whole-stack architecture challenge, hard 500-physical-line maximum and separate 95% line/branch floors remain intact. Existing stricter gates remain authoritative. Secret checks redact before output. Conditional detail lives in references, rather than imposing every specialist procedure on every task.

## Independent review and forward use

An independent source reviewer read the revised entries, references and specifications and returned **meets the bar, no material findings**. This is a source-review verdict, not certification of agent effectiveness.

A fresh evaluator received scenario facts without an intended answer, loaded the relevant skills, and produced these outcomes:

- **Performance:** a successful-response median fell from 110 to 82 ms (25.45%), while success fell from 900/1000 to 600/1000. The evaluator rejected a general or causal speed claim, identified organization clustering and selection from thirty exploratory runs, and requested independent confirmation with reliability guardrails.
- **Release:** dropping an old field during a five-minute old/new instance overlap was incompatible. An old image alone could not recover removed state. The evaluator required reconciliation of the unknown deployment effect before retry, preserved dirty configuration and distinguished the tested tree from HEAD.
- **UI:** eight selected items produced three confirmed deletions, two refusals and three unknown outcomes. Proposed wording preserved those distinctions, removed unsupported Undo and retained unresolved rows. Rendered and accessibility checks remained explicitly unverified.
- **Python implementation:** an owned synthetic JSON decoder was built test-first. It preserves digit-string identifiers and caller data, parses decimal amounts from text, rejects duplicate keys and nonfinite JSON constants, and rejects numeric identifiers/amounts.

The Python red run executed 51 tests with 47 failed assertions and four positive-result errors. The first implementation run exposed one erroneous test assumption: `1e400` is a finite numeric token even though binary-float conversion can overflow. The evaluator corrected the test to require exact Decimal parsing and retained both failure records. Final execution passed all **51 tests**, with no skips.

Actual Coverage.py collection measured **27/27 executable lines and 10/10 branch outcomes**, separately 100%, over the independently inventoried decoder source. The bundled 95% checker passed. A separate deliberately failing branch-count copy failed the gate; that copy is checker evidence, not collector output. Tooling: Python 3.14.5, Coverage.py 7.15.3 and Node 24.16.0.

Final decoder SHA-256: `0c3cff7232655040da96609517c4d28f094bca7e58e70d5d9c38347de07a3360`.
Final test SHA-256: `c38464b148dae6a704fd2777bfc1bf228191fcddcaff5103ed11caaa2b4a813a`.

Separate local assertions exercised JavaScript precision/grouping and ownership snapshots, Python JSON/decimal behavior, and a Rust UTF-8/shared-ownership/fallible-collection example. These ran with Node 24.16.0, Python 3.14.5 and rustc 1.95.0. They do not establish async integration or cross-version compatibility.

## Package verification

- `npm run check`: all 22 automated tests passed; both seventeen-skill packages built; repository code-file gate passed across 20 discovered files.
- All seventeen canonical skill validators passed; package-local reference checks passed.
- Claude Code strict package validation passed, with an informational README installation suggestion.
- `git diff --check` passed; current-source excluded-name scan found no matches.
- Codex 0.7.0 installed and enabled. All 46 installed skill/reference files matched their built package hashes.
- An additive inventory covers the five ignored code fixtures used in this review. The combined scan passed across 25 code files. The decoder and its tests contain 40 and 70 physical lines respectively.

Raw logs, collector output, source fixtures and intermediate failures remain in ignored `.engineering-team` directories. Exported results contain synthetic data and no credentials. No application code, deployment or production experiment was changed by the forward evaluator.

## Limits

The review exercises selected decisions and a small synthetic implementation. It does not establish comparative quality gains, measured application performance improvements, full behavioral certification of every skill, or fresh CLI discovery for this version. No browser rendering, live release, production recovery, CI integration, static TypeScript check, older language runtime or async application integration was executed. Installed-file parity and package validation remain distinct from those checks.
