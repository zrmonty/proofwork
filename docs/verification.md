# Verification record

October 10, 2026. Proofwork 0.1.0 is a usable local development release with explicit host-certification gaps. This record separates executed checks from design requirements that still need real-host evaluation.

## Executed checks

| Check | Observed result | What it establishes |
| --- | --- | --- |
| `npm test` on Node 24.16.0, Windows | 10/10 pass | Router, pure transition snapshots, ownership overlap, metadata, stale results/evidence, latest-failure gating, junction/path rejection, locking, backups, package references, and real Git commit message checking |
| `npm run build` | Two packages, 12 skills each | Canonical authored assets assemble with host adapters and resolve local Markdown references |
| Claude Code 2.1.296 strict package validation | Pass | Claude manifest shape and declared local paths accepted by the host validator |
| Claude Code 2.1.296 strict marketplace validation | Pass after adding required descriptive metadata | Repository marketplace and relative package entry accepted |
| Claude isolated marketplace installation | Installed, enabled, version 0.1.0 | Actual package install through Claude's registry in a temporary configuration directory; personal configuration was not changed |
| Controlled fresh worker, loaded Proofwork root | Router and selected skills read, regression reproduced, one-line fix, unchanged test passes | Actual workflow execution using original bundled guidance and real host tools |
| Parent review and local completion guard | Complete after reviewed result and current evidence | Artifact inspection and local lifecycle/evidence gate exercised end to end |
| Independent code/maintainability review | Meets the bar; reproduced findings fixed and rechecked | Separate source review, not universal runtime certification |

The tests were observed failing before new tool implementation. Independent review reproduced a completion false positive (old pass concealed a later failure) and record-reference retention. Fixes added latest-observation gating and cloned record snapshots, with regressions. The earlier review report preserves historical findings and explicitly clears them in its follow-up.

## Behavioral evaluation

The intentional export fixture drops its final item. Its acceptance test fails before modification. A fresh worker read use-proofwork, the host adapters, and the tool/contracts, then executed routing and read the returned bug-fix playbook and worker/functional/data/clean/TypeScript skills. It changed only `pages.slice(0, -1)` to `pages.slice()`.

The unchanged test passed for multi-page, single-page, empty-array, and input-preservation cases. The parent independently inspected the actual file and reran the test, recorded a reviewed result on the integrated content identity, and completed the local checkpoint. Evidence artifacts were hashed. Node directly executed the TypeScript value code; no static TypeScript compiler check was claimed. The disposable fixture did not activate its own native goal.

Reusable seed: [export fixture](../evals/fixtures/export-last-page/README.md). Sanitized observations: [controlled evaluation](../evals/results/controlled-codex-evaluation.md), [checkpoint](../evals/results/controlled-checkpoint.json), and [independent review](../evals/results/independent-review.md).

The fresh Codex CLI baseline already handled generic ownership, stale-evidence, review-only authorization, purity, and absent-browser cases well. Proofwork adds explicit product contracts/routing; these observations do not demonstrate a speed, quality, or cost improvement. See [baseline](../evals/results/baseline.txt). Broad scenario interpretation is weaker evidence than a real code task; scenario rubrics remain available for future repeated runs.

## Host matrix and limitations

| Surface | Tested | Still unverified |
| --- | --- | --- |
| Current Codex desktop collaboration host | Fresh worker explicitly loaded the locally staged skill root, ran bundled routing/tools, repaired fixture, returned evidence | Fresh-session marketplace loading, registered slash-menu behavior, repeated automatic goal continuation with installed plugin |
| Codex CLI 0.150.1 | Baseline response and attempted skill discovery | Repository marketplace was not listed in this environment; a subprocess smoke test discovered the local skills but could not launch shell tools or write under its effective sandbox. No successful CLI execution claim |
| Claude Code 2.1.296 | Strict validation and isolated local marketplace installation/listing | Authenticated task execution, subagent integration, browser operation and native goal continuation. Auth status reported loggedIn false; no credentials were requested or changed |

The supplied build task ran under an actual Codex goal with native goal tools. That does not prove installation, automatic continuation, or identical goal semantics in every target host. Adapters defer to the live host contract. A package cannot provide tool access or silently bypass host permissions.

Functional guidance and language/frontend scenarios were reviewed independently. Full Rust and Python target-project tasks, static TypeScript checks, mixed-language integration, desktop/mobile browser visuals, and repeated team-versus-single-agent comparisons were not executed. These remain release-certification gates. No beauty score, objective AI-layout detector, or multi-provider routing result is claimed.

## Reproduce

```text
npm test
npm run build
claude plugin validate ./packages/claude-code --strict
claude plugin validate . --strict
```

If Claude is not globally installed, the validator can be invoked through the official npm package without adding a Proofwork dependency:

```text
npm exec --yes --package @anthropic-ai/claude-code -- claude plugin validate . --strict
```

For a behavioral run, copy the intentional fixture into a disposable repository, stage the complete built package for the host's skill/plugin discovery, and invoke use-proofwork. Preserve the seed acceptance test. Capture baseline, exact implementation identity, post-fix command output, loaded skills, review, and gaps. Do not compare this one task as a benchmark.

## Authorship and delivery

Every shipped skill has a project-specific [specification](skill-specs/) and behavioral cases. Instructional files were independently authored, not copied/adapted from existing skills. Canonical assets are deliberately replicated into our own two packages by the build. The authorship/source review found no imported instructional assets; this is a review record, not automated proof of independent authorship.

Newly authored commits include Major features and Minor features sections. The formatter check runs against actual Git history and validates structure only. Raw provider event logs and stderr are excluded from Git; exported summaries omit credentials. No global scheduler, hook, credential store, external release publication, or mixed-provider bridge was installed.

GitHub delivery: the design baseline is on `main` and the implementation is on `codex/proofwork`. SSH push succeeded. PR creation was rejected because the current GitHub CLI account (`ZmontyVD`) has READ permission on `zrmonty/proofwork`. The prepared description is preserved in `docs/pull-request.md`; credentials and account configuration were not changed.

## Follow-up: installed Codex self-audit

The 0.1.1 [self-audit](../evals/results/self-audit-20261010.md) verifies explicit marketplace registration, installation, fresh CLI skill discovery and shell/routing execution. It supersedes the initial CLI discovery/sandbox gaps for that tested configuration. All 14 tests pass; three demonstrated defects were fixed and independently reviewed. Broader host gates remain as documented in that report.

## Follow-up: deeper original skills

Version 0.2.0 revises all twelve skills, adds nineteen conditional reference documents and deepens the shared contracts. The [skill-depth report](../evals/results/skill-depth-20261010.md) records source review, package validation, executed examples and fresh forward-use cases. All fourteen runtime tests still pass. These checks do not establish comparative quality gains or expand the certified host matrix.

## Follow-up: architecture and production finishing

Version 0.3.0 adds architecture-fit and production-finish with four conditional references. The [verification report](../evals/results/architecture-finish-20261010.md) records independent source review, corrected routing regressions, contrasting architecture decisions and an executed Docker build, artifact scan and HTTP smoke test. All fifteen tests pass; both fourteen-skill packages build, Claude strict validation passes and Codex 0.3.0 is installed and enabled. The static fixture does not certify a real application's capacity, recovery, credential response or live deployment.

## Follow-up: performance and gated TDD

Version 0.4.0 adds performance-increase, tdd-95 and a bundled executable coverage checker. The [verification report](../evals/results/performance-tdd-20261010.md) records independent review, real collector pass/fail and omission checks, measured lookup and benchmark-harness changes, and test consolidation without an unsupported runtime claim. All nineteen tests pass; both sixteen-skill packages build, Claude strict validation passes and Codex 0.4.0 is installed and enabled. Collector provenance, actual-project coverage and production performance remain separate obligations.

## Follow-up: human application copy

Version 0.5.0 adds humanizer with two conditional references and frontend integration. The [verification report](../evals/results/humanizer-20261010.md) records independent sample-copy use, state/structure preservation and corrected routing cases. All twenty tests pass; both seventeen-skill packages build, Claude strict validation passes and Codex 0.5.0 is installed and enabled. The text fixtures do not certify rendered interfaces, translations or reader satisfaction.

## Follow-up: hard 500-line maximum

Version 0.6.0 enforces the hard code-file maximum through implementation, review and completion guidance and bundles an executable checker. The [verification report](../evals/results/file-limit-20261010.md) records boundary tests, independent review and the passing 20-file repository scan. All twenty-two tests pass; both seventeen-skill packages build and npm run check now includes the gate. Source discovery requires an additive inventory for custom or ignored project code and does not replace architectural review.

## Follow-up: active architecture challenge

Version 0.6.1 requires each major architecture choice to earn its place, including whether the component is needed at all. The [forward-use report](../evals/results/architecture-challenge-20261010.md) records concrete omit/replace decisions for an overbuilt static publication and reasoned retention plus topology questions for an established transactional app. All twenty-two tests and the file gate pass; both packages build and Codex 0.6.1 is installed. Hypothetical reasoning does not establish target-app operating evidence.

## Follow-up: second full skill review

Version 0.7.0 strengthens all seventeen skills and their specifications, covering ownership, numerical semantics, causal measurement, partial UI outcomes, mixed-version recovery, truthful coverage and integrated evidence. The [review report](../evals/results/skill-depth-round2-20261010.md) records independent source review, fresh forward scenarios and a test-first Python fixture with 51 passing tests, 100% lines and 100% branches from actual collection. All twenty-two package/runtime tests pass, both packages build, strict Claude validation passes and Codex 0.7.0 is installed with matching skill/reference hashes. Selected fixtures do not certify rendered interfaces, live releases or comparative effectiveness.

## Follow-up: strict Python typing

Version 0.7.1 makes strict static typing a Python completion requirement, covering implementation, affected callers and Python tests. It requires typed interfaces, parameterized generics and validated/narrowed external data, and rejects blanket suppressions, unchecked Any propagation and exclusions used to manufacture a pass. The revised reference code was extracted into an ignored fixture and passed Pyright 1.1.414 with `typeCheckingMode: strict` and Python 3.14 targeting: zero errors or warnings. Python runtime assertions passed for boolean rejection and caller-data preservation. All twenty-two automated tests passed, both packages built and the repository code-file gate passed; Codex 0.7.1 was installed. This fixture does not establish strict typing of an unrelated application, mypy compatibility or older-interpreter support. The checker ran through an ephemeral npm invocation; no project dependency or global configuration was added.

## Follow-up: functional state changes and data-driven code

Version 0.7.2 strengthens functional-programming, data-driven-development and the shared engineering defaults. Changed writes are inventoried; domain decisions for CRUD, UI, workflow, retries, reconciliation, cache invalidation and derived views should become pure next-state/effect calculations wherever possible. Inseparable framework/resource decisions require an explanation. Collection, commit and execution remain explicit boundaries; stale candidates cannot authorize effects. Data normalization, analysis and decisions consume unchanged snapshots and explicit policy. No event-sourcing framework or new runtime dependency was introduced.

The original Python transition reference was extracted into an ignored fixture. Runtime assertions passed for request/timeout/reconciliation sequences, deterministic replay, input preservation, duplicate requests/outcomes, unrelated operations, invalid-event no-ops and confirmed-absent recovery. Pyright 1.1.414 strict mode passed the example and verification code with zero diagnostics, targeting Python 3.10 syntax; execution used Python 3.14.5. All twenty-two automated tests passed, both seventeen-skill packages built and the code-file gate passed. These observations establish the example's pure decision contract only: real storage conflicts, framework repeated evaluation, provider delivery, recovery and actual Python 3.10 execution remain unverified.

## Follow-up: security auditing and hardening

Version 0.8.0 adds security-hardening, its two references and specification, root/production integration, intent routing and user command examples. The [verification report](../evals/results/security-hardening-20261010.md) records the failing-then-passing routing regression, all twenty-three passing tests, both eighteen-skill package builds, strict Claude validation and installed Codex file parity. Guidance requires supported findings, shared-boundary repairs, safe secret handling and distinguishing regression evidence. No application audit, scanner or live security test was executed for this skill release; package checks do not certify application security.

## Follow-up: dead-code and attached-test cleanup

Version 0.9.0 adds dead-code-audit, a reachability/test-ownership reference, specification, routing and README commands. The [verification report](../evals/results/dead-code-audit-20261010.md) records the red/green routing test, all twenty-four passing tests, both nineteen-skill builds, strict Claude validation and installed Codex parity. The skill removes proven dead responsibilities and exclusively attached tests while protecting dynamic/public consumers, shared fixtures and live guarantees. No target-application cleanup was executed for this release; structural checks do not establish exhaustive reachability.

## Follow-up: DRY and a single audit entry

Version 0.10.0 adds dry-audit and audit-stack, specifications, aggregate routing and host command documentation. The [verification report](../evals/results/audit-stack-20261010.md) records red/green routing, a CLI aggregate route, all twenty-five passing tests, both twenty-one-skill builds, strict Claude validation and installed file parity. Audit-stack reuses the coordinator to merge supported findings and verify integrated repairs across core lenses, adding UI/release checks when relevant. No target-application combined audit or measured improvement was executed; per-lens evidence and unresolved gates remain explicit obligations.

## Follow-up: deeper visual direction and interface craft

Version 0.10.1 strengthens frontend-design with actionable direction, reference translation, representative vertical slices, a new interface-craft reference and hypothesis-driven rendered critique. Specifications and authored scenarios cover typography/fallback, grouping, selective softness, assets and truthful interaction states. The [verification report](../evals/results/design-craft-20261010.md) records twenty-five passing tests, both package builds, strict Claude validation and installed design-file parity. No target interface or browser evaluation was executed; visual and interaction claims still require observed rendered evidence.

## Follow-up: references across every skill

Version 0.11.0 adds twenty-one conditional references across all twenty-one skills, expanding the collection to fifty-five references. Entries and specifications map the new decision support; a [reference guide](reference-guide.md) makes it discoverable. The [verification report](../evals/results/references-expansion-20261010.md) records independent source review, separate hypothetical scenario reasoning, all twenty-five passing tests, both package builds, all skill validators, strict Claude validation and installed parity across seventy-six skill/reference files. These checks do not establish application-level behavioral certification or comparative improvement.

## Follow-up: deep Rust decisions and checked example

Version 0.12.0 expands Rust guidance to seven references with deeper API/error, pure-transition, async/backpressure, performance/representation and unsafe/FFI decisions. The [verification report](../evals/results/rust-depth-20261010.md) records independent source review, an original eight-test red/green Cargo fixture passing debug/release, formatting and Clippy, all twenty-five package tests, both builds, strict Claude validation and installed parity across eighty skill/reference files. The synthetic version gate does not establish real transactions or delivery; async, unsafe, benchmark, numerical coverage and minimum-toolchain claims remain unverified.

## Follow-up: ten-line functions and separate complexity review

Version 0.12.1 adds a hard ten-physical-line cap for complete project-owned function definitions to clean-code, shared principles, coordination and structural review. Cohesive extraction preserves behavior, caller compatibility and independent test guarantees; short but dense functions still receive complexity findings. The [verification report](../evals/results/function-cap-20261010.md) records twenty-five passing tests, both builds, three changed-skill validations, strict Claude validation and installed parity across eighty-one skill/reference files. No automatic function checker, repository-wide function audit or runtime refactor was performed; the file checker cannot prove this new function requirement.

## Follow-up: skill compression as the product goal

Version 0.13.0 makes [skill compression](vision.md) the main goal: users steer through intent, taste and judgment while Proofwork carries engineering detail and verifies the result. Root, worker and architecture guidance now implement that division of responsibility; expertise and consequential authority remain accessible. The [verification report](../evals/results/skill-compression-20261010.md) records all twenty-five tests, both builds, changed-skill validators, strict Claude validation, independent textual review and installed parity across eighty-two skill/reference files. No comparative newcomer evaluation or fresh application workflow was executed, so reduced cognitive burden remains a goal to measure rather than a claimed improvement.

## Follow-up: stage-aware entry routing

Version 0.14.0 adds the original brainstorm skill and routable/checkpointable brainstorm, architecture and production-finishing playbooks. Root guidance routes the current prompt and inspected context, carries accepted briefs forward and reassesses the current subtask at transitions without expanding authority. The [verification report](../evals/results/stage-routing-20261010.md) records a red/green routing cycle, all forty-two passing tests, both twenty-two-skill builds, validators, independent review and installed parity. New-router LCOV coverage passes at 100% lines and 98.57% branches; the broader target including the existing coordinator fails the branch floor at 88.43% and remains a named gap. Full conversational stage progression is not certified by deterministic router tests.
