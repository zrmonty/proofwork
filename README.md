# Proofwork

Install in Codex (Bash or PowerShell 7): `codex plugin marketplace add zrmonty/proofwork && codex plugin add proofwork@proofwork-local`. See [installation](#build-and-local-installation) for local builds and Claude Code.

Install in Claude Code 2.1.275+: `/plugin install proofwork --marketplace zrmonty/proofwork`.

See the [skill reference guide](docs/reference-guide.md) for conditional decision guides and worked scenarios across the full skill set.

Proofwork is a **skill-compression plugin for Codex and Claude Code**. Describe what you want to make, judge the result and refine it. Proofwork carries the engineering detail: choosing relevant skills, making proportionate implementation decisions, coordinating workers when useful and verifying the integrated result.

**Our north star: turn a clear intention into useful, distinctive, verified software without making the user manage the engineering machinery.** Purpose, taste and consequential choices stay with you. The plugin supplies the discipline behind them. Read the [product vision](docs/vision.md) for what this means and how we evaluate it.

Proofwork aims to make software creation accessible through intent and judgment, while helping a team write less, better code. All shipped instructions are originally authored to [our specification](docs/design/2026-10-10-proofwork-design.md). No existing skill files were imported or adapted.

Functions and files have no universal line-count ceiling. Keep names clear, responsibilities cohesive, control flow understandable and safety checks intact. A project can opt into its own file-size policy; the bundled checker is disabled until a limit is explicitly supplied.

## Start

The root is **use-proofwork**. Supported command spelling depends on the host:

- Codex: select `use-proofwork` from the skills menu, or invoke `$use-proofwork` in your prompt. Available slash-menu labels are controlled by Codex.
- Claude Code plugin: `/proofwork:use-proofwork <task>`.
- Claude Code standalone skill, if deliberately installed in the project's `.claude/skills/use-proofwork/`: `/use-proofwork <task>`. The rest of the package must remain available at the relative paths described in the installation section; copying only the root file is insufficient.

The entry skill considers your prompt and existing context, invokes the bundled router and reads the selected guidance. On an existing codebase it acts with high agency: trace relevant behavior and consumers, pursue supported high-impact improvements, implement within your authority and verify the result. It reassesses the current stage as the task develops:

| Current need | Starting workflow |
| --- | --- |
| New project or unresolved idea | brainstorm: audience, journey, direction and first useful slice |
| Architecture or consequential tool decisions | architecture-fit: simplest adequate structure and operating fit |
| Implement an accepted direction | feature workflow with relevant language, design and verification skills |
| Broken behavior | bug-fix: reproduce, repair and verify |
| Review or simplify existing work | review/refactor with appropriate audit and maintainability guidance |
| Measured speed improvement | performance-increase with a representative baseline |
| Prepare an app for production | production-finish with actual hosting and release constraints |

You can enter at any stage. An accepted design does not need another brainstorming round; a focused bug fix does not need a new architecture. The root carries the brief forward and selects the next relevant skills within your request. It is an agent workflow, not a daemon intercepting unrelated prompts. Once a run is active, the checkpoint records the root mode and continuation instructions.

Routing returns a **light**, **standard** or **full** tier. Small mechanical edits load a short procedure and relevant language entry. Behavioral or larger work loads shared implementation discipline and executable verification. Security, concurrency, migrations, parallel work and audit-stack use full coordination. Automatic loading of the thermonuclear review lens applies only in full; substantial integrated work still receives independent review. Conditional references load when needed; the budget measures initial guidance, not total model usage.

Example request:

```text
Use Proofwork to fix the export. It sometimes loses the final page.
Keep the current file format and show me that the full document survives.
```

## Skill commands

Version 0.19 renames `setup` → `pw-setup`, `worker-mode` → `pw-worker-mode`, and `clean-code` → `pw-clean-code`; update prompts or automation using the old names. Setup, workers and audit-stack are manually invoked. The root can deliberately read their guidance when needed.

Give any skill a task in the same prompt. In Codex, use `$<skill-name>` or select the Proofwork skill in the skills menu. In the Claude Code plugin, use `/proofwork:<skill-name>`. If another installed plugin has a skill with the same name, select the Proofwork entry explicitly. The root loads relevant guidance automatically; individual commands are useful for focused work.

| Codex invocation | Claude Code invocation | Use it for |
| --- | --- | --- |
| `$use-proofwork` | `/proofwork:use-proofwork` | Carry a task through discovery, routing, bounded workers, review and evidence. |
| `$pw-setup` | `/proofwork:pw-setup` | Inspect host capabilities, toolchains, model roles and repository checks. |
| `$language-fit` | `/proofwork:language-fit` | Compare languages, runtimes and frameworks across systems, scripting and fullstack needs; justify each choice and mixed-language boundary. |
| `$architecture-fit` | `/proofwork:architecture-fit` | Challenge every major stack component, compare simpler adequate alternatives and justify tools from real requirements. |
| `$production-finish` | `/proofwork:production-finish` | Prepare an app for production, inspect secret exposure, establish hosting and build a suitable container when needed. |
| `$performance-increase` | `/proofwork:performance-increase` | Profile and optimize with actual before/after benchmarks, clear savings and resource tradeoffs. |
| `$tdd-95` | `/proofwork:tdd-95` | Use test-first development with separate 95% line/branch gates and consolidate redundant tests while preserving fault detection. |
| `$brainstorm` | `/proofwork:brainstorm` | Shape a new project or unresolved idea into a concrete direction and first useful slice. |
| `$pw-worker-mode` | `/proofwork:pw-worker-mode` | Execute a bounded assignment and return a reviewable result. |
| `$thermo-nuclear-code-quality-review` | `/proofwork:thermo-nuclear-code-quality-review` | Audit maintainability and report concrete structural findings with a verdict. |
| `$typescript-best-practices` | `/proofwork:typescript-best-practices` | Apply TypeScript guidance to types, validation, effects and tests. |
| `$rust-best-practices` | `/proofwork:rust-best-practices` | Apply deep Rust guidance for borrowing, collections, iterator types, conversions, traits, numeric contracts and pure transitions; verify async, performance and unsafe/FFI obligations. |
| `$python-best-practices` | `/proofwork:python-best-practices` | Apply Python guidance to data models, boundaries, resources and tests. |
| `$functional-programming` | `/proofwork:functional-programming` | Match existing style; extract pure transitions for qualifying stateful, retry, concurrency, caching or shared-state work. |
| `$data-driven-development` | `/proofwork:data-driven-development` | Model invariants and evaluate changes using observed data and repeatable checks. |
| `$pw-clean-code` | `/proofwork:pw-clean-code` | Clarify responsibilities and naming; simplify complexity while preserving behavior and safety guards. |
| `$frontend-design` | `/proofwork:frontend-design` | Develop a distinctive visual direction; refine composition, typography, assets and interaction states through rendered critique. |
| `$humanizer` | `/proofwork:humanizer` | Write natural application copy, simplify unnecessary headings and footer content, and keep interaction wording accurate. |
| `$security-hardening` | `/proofwork:security-hardening` | Audit trust boundaries, fix supported vulnerabilities and verify repairs with safe adversarial regression checks. |
| `$dead-code-audit` | `/proofwork:dead-code-audit` | Remove proven dead code and exclusively attached tests, then verify surviving behavior and runtime entry points. |
| `$dry-audit` | `/proofwork:dry-audit` | Consolidate duplicated rules and responsibilities while preserving distinct policies and consumer checks. |
| `$audit-stack` | `/proofwork:audit-stack` | Coordinate security, dead-code, DRY, performance, TDD/coverage, architecture and maintainability audits with one integrated result. |
| `$commit-features` | `/proofwork:commit-features` | Honor the repository commit convention; optionally check Proofwork or Conventional Commit formatting. |

Examples for Codex:

```text
$use-proofwork Find and fix issues in this repository. Reproduce bugs first and use independent review.
$thermo-nuclear-code-quality-review Review the current diff and its callers. Report findings without editing.
$frontend-design Refine the article page with a content-led editorial identity and verify desktop/mobile behavior.
$humanizer Rewrite this application's copy in a natural, direct voice. Reduce repetitive headings and footer sections while preserving useful navigation, facts and behavior.
$commit-features Prepare a commit message from the staged diff and check the outgoing history.
$language-fit Choose languages and frameworks for this project from actual workload, safety, integrations and maintenance needs. Compare systems, scripting and fullstack options without defaulting to TypeScript.
$architecture-fit Challenge this proposed stack. Explain why each major tool is needed, recommend simpler adequate alternatives and omit unearned complexity.
$production-finish Prepare this app for production. Check for exposed secrets, ask about hosting and build a Docker image if it fits.
$performance-increase Improve this parser's throughput and shorten its benchmark run. Preserve correctness and report comparable measurements.
$tdd-95 Implement the approved behavior test-first, enforce the 95% coverage gate and consolidate redundant test setup and cases.
$security-hardening Audit and harden this app. Trace reachable vulnerabilities, fix shared causes, preserve legitimate behavior and report verification gaps.
$dead-code-audit Find and remove dead code and its exclusively attached tests. Check dynamic entry points, public contracts and shared fixtures before deletion.
$dry-audit Find duplicated domain rules, consolidate their owner and verify all affected consumers.
$audit-stack Audit and fix this repository. Preserve supported behavior and report findings and verification gaps for each lens.
```

For Claude Code, replace the skill token with its namespaced command, for example `/proofwork:use-proofwork Find and fix issues in this repository`. `/use-proofwork` is the product entry name; a bare slash alias depends on host installation and is not guaranteed by the plugin. Commands reuse the host's available tools and permissions. Invoking a review or commit skill alone does not authorize edits, pushing or publishing.

Run the combined workflow in Claude Code with `/proofwork:audit-stack` or in Codex with `$audit-stack`. By default it audits and makes scoped local repairs; append `report only; do not edit` for a read-only run. Every core audit lens receives a status with evidence, a reason it is not applicable, or a specific missing check. UI/copy and production finishing are included when relevant. It merges overlapping findings into one repair plan and verifies the integrated result; it does not deploy or claim every check passed merely because a skill loaded.

[Architecture fit](shared/skills/architecture-fit/SKILL.md) actively challenges the proposed and relevant existing stack: why is this component needed, and what simpler arrangement would satisfy the project? PostgreSQL, frameworks, ORMs, API layers, queues, caches and orchestration must each earn their place. It recommends what to keep, replace, omit or defer based on real requirements and total burden, including migration costs. No database brand or audience size supplies a default answer.

[Production finish](shared/skills/production-finish/SKILL.md) establishes hosting with the user, checks the actual production artifact for public secret exposure, and verifies the relevant build, runtime and recovery behavior. When containers fit, it can build and smoke-test a Docker image. It treats packaging, scaling and live deployment as distinct deliverables and reports any missing evidence or required credential response.

[Performance increase](shared/skills/performance-increase/SKILL.md) measures the real workload before changing code and distinguishes application improvements from shorter benchmark execution. [TDD 95](shared/skills/tdd-95/SKILL.md) requires at least 95% line coverage and 95% branch coverage over the agreed executable target, preserving stricter existing gates. Its bundled checker rejects missing files, unavailable metrics and below-threshold results. Tests are consolidated by behavior and repeated cost; distinct failures and reliable diagnostics remain covered. These workflows use the project's real tools; the coverage checker evaluates exported counts and does not itself collect coverage or establish test quality.

## Build and local installation

Requires Node.js 22 or newer for the local tools. No npm dependencies are required.

```text
npm test
npm run build
```

Build writes `packages/codex/` and `packages/claude-code/`. Each contains the shared authored skills, relevant host adapter, playbooks, contracts, and local tools. Build validates bundled references. Run-state artifacts live in the target project's `.engineering-team/runs/`, not in the plugin package.

For Codex, explicitly register the trusted checkout and install the package:

```text
codex plugin marketplace add . --json
codex plugin add proofwork@proofwork-local --json
codex plugin list --json
```

Confirm that Proofwork is installed and enabled, then start a fresh session and invoke `$use-proofwork`. The installer adds the marketplace/plugin entries to Codex configuration; it does not require replacing personal config. Repository metadata alone does not register a marketplace. After rebuilding an updated version, run `codex plugin add proofwork@proofwork-local --json` again and verify the installed version. See [Codex adapter](adapters/codex/runtime.md) and [self-audit evidence](evals/results/self-audit-20261010.md).

For Claude Code, load the built package for the session:

```text
claude --plugin-dir ./packages/claude-code
```

Then invoke `/proofwork:use-proofwork`. For persistent installation from a trusted local checkout containing the built package:

```text
/plugin marketplace add .
/plugin install proofwork@proofwork-local
```

The repository includes a Claude marketplace pointing to the built package. Use a checkout containing `packages/claude-code` and run the build before installing local changes. See [Claude adapter](adapters/claude-code/runtime.md).

Both platforms namespace or expose skill commands themselves. Proofwork does not claim a bare global `/use-proofwork` alias where the host does not support one.

## Work within a goal

Use the host's native `/goal` and include the Proofwork entry and the completion contract in its objective:

```text
/goal Use Proofwork to implement the approved design in docs/design.md. Complete
when its required behaviors have current evidence on the integrated code,
material review findings are resolved, and the authorized delivery is finished.
Preserve its constraints and checkpoint the next action before yielding.
```

Host goal semantics remain authoritative. Calling Proofwork alone does not create a goal. It preserves an existing objective, respects supplied limits and interruption, and never treats a budget stop as success. The local completion guard is additional bookkeeping; it cannot complete the host's goal or verify a test merely from a claimed result.

## Local tool commands

These are shell commands for coordinators and contributors. `<plugin-root>` is the installed package root; in this source checkout use `packages/codex` after building. `<repo>` is the target repository. Mutations require its coordinator owner. JSON schemas and recovery rules are in the [tool reference](scripts/README.md).

| Command | Purpose |
| --- | --- |
| `node <plugin-root>/scripts/proofwork.mjs --help` | Show usage. |
| `node <plugin-root>/scripts/proofwork.mjs route --task "Fix export bug" --files src/export.ts` | Select a playbook and skills. |
| `node <plugin-root>/scripts/proofwork.mjs init --repo <repo> --run <id> --owner <session> --objective "Fix export" --revision <identity> --criteria regression,review` | Initialize a unique run. |
| `node <plugin-root>/scripts/proofwork.mjs status --repo <repo> --run <id>` | Inspect a checkpoint. |
| `node <plugin-root>/scripts/proofwork.mjs assign --repo <repo> --run <id> --owner <session> --input <record.json>` | Register task ownership. |
| `node <plugin-root>/scripts/proofwork.mjs result --repo <repo> --run <id> --owner <session> --input <record.json>` | Record a result or review. |
| `node <plugin-root>/scripts/proofwork.mjs evidence --repo <repo> --run <id> --owner <session> --input <record.json> [--command <check>]` | Execute a check and record actual exit/duration/digests, or record weaker manual evidence. |
| `node <plugin-root>/scripts/proofwork.mjs finding --repo <repo> --run <id> --owner <session> --input <record.json>` | Record or resolve a finding. |
| `node <plugin-root>/scripts/proofwork.mjs checkpoint --repo <repo> --run <id> --owner <session> --input <record.json>` | Save phase, revision, routing and next action. |
| `node <plugin-root>/scripts/proofwork.mjs complete --repo <repo> --run <id> --owner <session> --revision <identity>` | Check recorded completion gates; does not complete a native goal. |
| `node <plugin-root>/scripts/proofwork.mjs preflight --repo <repo> --run <id> --owner <session> --revision <identity>` | Read-only readiness JSON; inspect ready, not exit zero. |
| `node <plugin-root>/scripts/hook-binding.mjs bind --repo <repo> --host codex --session <host-session> --run <id> --owner <owner>` | Explicitly bind a run for optional lifecycle hooks; unbind accepts the same selectors. |
| `node <plugin-root>/scripts/check-commits.mjs --repo <repo> --range <outgoing-range>` | Check explicitly opted-in commit formatting; absent policy defaults to off. |
| `node <plugin-root>/scripts/check-coverage.mjs --report <report.json> --inventory <inventory.json> [--threshold 95..100]` | Enforce separate line/branch floors against an independently enumerated source target. |
| `node <plugin-root>/scripts/check-file-lines.mjs --repo <repo> [--limit <project-ceiling>] [--inventory <additional-code-paths.json>]` | Check an explicitly chosen project file-size policy; disabled by default. |
| `npm test` | Run the source repository's tests. |
| `npm run build` | Regenerate both packages. |
| `npm run context-budget` | Check distinct trigger phrases, 600-word entries, 800-word references and initial guidance budgets. |
| `npm run check:coverage` | Run tests, collect real Node LCOV and enforce separate 95% gates. |
| `npm run check` | Check source width, context budgets, actual coverage, packaging and optional project policy. |

Run state binds observations to Git HEAD/tree and a filesystem digest including dirty and untracked files. Checkpoint after content changes. Executed evidence uses `--command` because `--run` already names the coordination run. Manual evidence is marked `claimed` and blocks completion unless `--allow-claimed` is explicit. A trivial command such as `true` still passes; review whether the command actually proves its criterion. Workers and native goals remain host-managed.

## Included guidance

- Team root, worker discipline, setup, and task playbooks for brainstorming, architecture, investigation, bug fixes, features, refactoring, reviews and production finishing.
- TypeScript, Rust, and Python practices selected by task/files.
- Conditional functional programming: match the codebase's dominant style first. Extract a pure transition for at least three meaningful states or event types, a real partial-failure/retry path, or domain logic needing tests without the framework. Otherwise follow surrounding code. Caller-data preservation and named mutable owners apply in every tier.
- Data-driven development and clean code: model invariants, measure meaningful changes, remove unnecessary mechanisms, and test observed behavior.
- Frontend design: content-specific editorial identity, coherent softer shapes, accessible responsive behavior, meaningful visual iteration, and rendered evidence.
- Thermonuclear maintainability review: concrete opportunities to simplify structure, strict scope/evidence rules, and an explicit verdict.
- Commit features: honor the repository convention and truthful validation; formatting checks require explicit commitFormat opt-in and default to off.

Model roles use actual host capabilities and user-selected settings. Native alternatives are supported where available; mixed-provider routing requires an explicit external bridge and is not bundled. Shell execution and available browser control are reused. Missing capability is reported, never simulated.

## Verification and limits

The initial guidance for the same TypeScript parser bug fell from **7,036 to 2,534 words** (about 64%). Conditional reference loading is additional; this does not establish model-token savings or agent quality. The comparative harness contains eight tasks and defaults to three repetitions per arm. Its actual pilot produced this result:

| Arm | Attempts | Completed implementations | Wall time | Input / output tokens reported by CLI | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| Bare | 1 | 0 | 21.00 s | 64,988 / 705 | Host blocked tools and writes; no files changed |
| Proofwork | 1 | 0 | 29.36 s | 120,426 / 899 | Same restriction; no files changed |
| Local reference profile | 0 | — | — | — | Comparison deferred after host failure |

These are blocked runs, not quality or performance scores. The full 72-run comparison remains unfinished. See the [evaluation report](evals/results/improvement-evaluation.md) for measurement scope, claim review and host limitations, and the [harness](evals/ab/README.md) to run it on a supported host. Further skill additions must cite a motivating evaluation.

See [verification](docs/verification.md) for exact executed checks, behavioral observations, tested host versions, and unverified release gates. Packaging tests establish packaging behavior; they do not certify agent quality or subjective visual appeal. The run-state guard enforces its recorded evidence contract, not truthfulness of arbitrary input supplied by an operator.

Standard packages contain no lifecycle hook configuration. Optional recovery, routing and completion hooks are built
separately with `npm run build:hooks`; see [setup and limits](docs/hooks.md). They require explicit session binding
and the host's installation/trust flow. No global hooks are installed automatically. Root invocation uses the host's
existing agent and tools. User authorization and project instructions govern work.

## Development

Edit `shared/` and the relevant `adapters/`; rebuild both packages from canonical authored assets. Each skill has a [specification](docs/skill-specs/) and scenario coverage. Use disposable repositories for lifecycle and integration tests. Never edit generated package copies as the source of a fix.

Skill entry files carry the essential decisions and operating constraints. Their linked `references/` contain focused worked examples, specialist guidance and review procedures; each entry explains when to read them. The root selects relevant skills, and those skills load the detail the task needs. See the [skill depth and evaluation standard](docs/skill-depth-review.md) for authoring and review criteria.

Commit formatting is optional. In the target repository, `.proofwork.json` may set `"commitFormat": "proofwork"`, `"conventional"`, or `"off"`. Missing configuration defaults to off. Proofwork never rewrites history or blocks a push for message formatting without explicit opt-in. The checker reports `{format, enabled, commits}`; Conventional mode checks subject syntax and body separation, not every semantic/footer rule. To inspect an opted-in outgoing range:

```text
node scripts/check-commits.mjs --repo . --range origin/main..HEAD
```

For an initial repository with no base, an explicit revision such as `HEAD` checks the reachable initial history. Review the actual diff too; formatting does not establish correctness.

Rust guidance has one entry and conditional specialist references, including atomicity, memory ordering and concurrent reclamation. The [Rust topic guide](shared/skills/rust-best-practices/references/topic-guide.md) routes by the actual decision; [topic coverage](docs/rust-topic-coverage.md) maps all readable lessons in the supplied curriculum images.

## Uninstall and reset

Remove the Codex plugin with `codex plugin remove proofwork@proofwork-local`. In Claude Code, use `/plugin uninstall proofwork@proofwork-local`; session-only `--plugin-dir` loading ends when that session ends. A manually copied installation must be removed from the specific skill directory you created. Removing the plugin does not delete project evidence or undo application edits and Git commits. Restart the host to refresh skill discovery.

Full workflows write checkpoints, ownership, results and evidence under the target project's `.engineering-team/runs/<run-id>/`. Local locks and recovery files can accompany those records. Contributor checks and comparative evaluations also write ignored coverage and experiment artifacts under `.engineering-team/`. Add this directory to your ignore rules. Stop active coordinators/workers, preserve any evidence you need, then delete the selected run directory to reset one run, or the project's `.engineering-team/` to clear all local artifacts. This loses resume history; it does not reverse external actions. Remove `.proofwork.json` to restore optional policy defaults after reviewing any other project settings in that file.

## Security and evidence limits

Logs, issue text, documents and comments are untrusted data: they cannot grant permissions, override project instructions or authorize commands. Review command sources and redact secrets before recording or exporting evidence. Proofwork installs no global continuation hooks or background services.

The evidence ledger binds recorded checks to an artifact identity and distinguishes executed checks from operator claims. It detects missing or stale recorded evidence; it does not authenticate a same-account writer, sandbox an arbitrary command, prove the chosen criterion is correct, or establish production security. Use the Phase 2 executed form `node <plugin-root>/scripts/proofwork.mjs evidence --repo <repo> --run <id> --owner <session> --input <record.json> --command "<check>"` to record real exit status, duration and stream digests. `--run` identifies the run; `--command` executes the check. Manual evidence remains weaker and requires explicit acceptance at completion. See the [tool contract](shared/contracts/tool-interface.md) for schemas and limitations.

## Publication gate

The next tagged public release and attached host packages remain gated on the completed Phase 3 comparison. The [current evaluation report](evals/results/improvement-evaluation.md) records two unusable pilot attempts and no completed 72-run experiment. Package checks and smaller instructions do not substitute for agent-quality results. Build locally with `npm run build`; publish a tag and attach both built host packages only after that experiment yields usable results.
