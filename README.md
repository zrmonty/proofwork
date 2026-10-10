# Proofwork

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/brand/proofwork-logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/brand/proofwork-logo.png">
    <img src="assets/brand/proofwork-logo.png" alt="Proofwork" width="360">
  </picture>
</p>

Proofwork is a **skill-compression plugin for Codex and Claude Code**. Describe what you want to make, judge the result and refine it. Proofwork carries the engineering detail: choosing relevant skills, making proportionate implementation decisions, coordinating workers when useful and verifying the integrated result.

Install in Codex (Bash or PowerShell 7): `codex plugin marketplace add zrmonty/proofwork && codex plugin add proofwork@proofwork-local`. See [installation](#build-and-local-installation) for local builds and Claude Code.

Install in Claude Code 2.1.292+: `/plugin install proofwork --marketplace zrmonty/proofwork`.

See the [integrated workflow](docs/flow.md) and [skill reference guide](docs/reference-guide.md) for conditional decision guides and worked scenarios across the full skill set.

**Our north star: turn a clear intention into useful, distinctive, verified software without making the user manage the engineering machinery.** Purpose, taste and consequential choices stay with you. The plugin supplies the discipline behind them. Read the [product vision](docs/vision.md) for what this means and how we evaluate it.

Proofwork aims to make software creation accessible through intent and judgment, while helping a team write less, better code. All shipped instructions are originally authored to [our specification](docs/design/2026-10-10-proofwork-design.md). No existing skill files were imported or adapted.

Functions and files have no universal line-count ceiling. Keep names clear, responsibilities cohesive, control flow understandable and safety checks intact. A project can opt into its own file-size policy; the bundled checker is disabled until a limit is explicitly supplied.

From a reviewed checkout, one command registers, installs and verifies the plugin: `node scripts/install.mjs --host codex` (or `--host claude-code`). Add `--source .` for the local built source. It does not configure model roles or lifecycle hooks. Older supported Claude versions can use the two-step marketplace registration/install flow in [first run](docs/first-run.md).

## Host and environment parity

Use Node 22 or 24 and Git on Windows, Linux or macOS. The same routing, evidence, recovery and package checks run
on [all six passing CI combinations](https://github.com/zrmonty/proofwork/actions/runs/38088882321).
Proofwork 0.35.0 is installed locally in Codex. Host execution remains separately verified: the native Codex installer is exercised
locally; Claude installation and event behavior need a machine with that host available.

For a CLI outside PATH, add `--cli "<absolute executable path>"` to the installer. For Windows npm installations,
supply the package's Node entry file (`.js`, `.cjs` or `.mjs`) instead of its `.cmd` wrapper. Proofwork invokes it
with the current Node runtime and literal arguments; it does not evaluate shell wrappers or change PATH.
Installation checks enabled status and the loaded folder version when Claude reports a folder source.
Command entry detection resolves symlinked parents, including macOS temporary paths; commands cannot silently
skip their entry point because the invocation path differs from Node's resolved module path.

Prefer `evidence --argv <check-argv.json>` for portable checks. The file is a JSON array such as
`["node", "scripts/check.mjs", "argument with spaces"]`; use an absolute executable when PATH differs between
hosts. Arguments are literal, without shell expansion. Choose `--command` explicitly for pipelines or other shell
syntax. Both forms have the same deadlines, snapshot binding and recorded exit/digest evidence. Neither is a
sandbox or command allowlist. See the [host/environment verification record](evals/results/host-environment-parity-20261010.md).

## Operator-ready releases

Codex 0.31.0 is installed and enabled. [Windows/Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38086672914)
passes full checks and package parity. See the [operator-guidance verification record](evals/results/ops-primitives-20261010.md).

For release work, Proofwork connects resolved dependencies to the inspected artifact, compares effective environment configuration, maps failure propagation and recovery, and generates useful logs, metrics and alerts with the change. It returns separate ready-for-staging and ready-for-production decisions with owned residual risks. See [operational scenarios](docs/operational-scenarios.md) and [production-finish](shared/skills/production-finish/SKILL.md). Live deployment and verification remain separate observations.

## Team principles without a fork

Codex 0.34.0 is installed locally; [Windows/Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38088199570) passes. See the [team-policy verification record](evals/results/team-policy-20261010.md).

Add two or three team rules to `.proofwork.json`, such as requiring an architecture decision before introducing a database or an executed restore test for migrations. Explained routing selects relevant rules and their required evidence; final reports and systems outcomes record their dispositions. Rules are host-agnostic, skip light work unless opted in and cannot grant deployment authority. See the [configuration and selector examples](shared/contracts/team-policy.md).

## First outcomes and operational handoff

Codex 0.33.0 is installed locally; [Windows/Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38087658789) passes. See the [executed first-outcome and recovery record](evals/results/first-outcome-recovery-20261010.md).

Start with a bounded real task and describe the behavior you want. The report should show the changed result, a check on the actual output, what remains uncertain and what you still own. See [first run and recovery](docs/first-run.md).

Every full-tier or Harden-and-Finish delivery links one [systems outcome](shared/contracts/systems-outcome.md): artifact-bound verification, failure/recovery steps, configuration and dependency drift notes, observability, and owned residual risks. Incomplete work produces the same handoff with explicit gaps. It is a reusable operator record, not a certification or deployment permission.

## Small tasks and interruptions

Codex 0.32.0 is installed locally. [Windows/Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38087156819) passes; see the [recovery verification record](evals/results/proportionate-recovery-20261010.md).

A typo fix or documentation edit can finish with the affected diff and a relevant check, without setup, workers or a run ledger. Documentation file counts alone do not increase the tier. Describe the remaining task when resuming, for example `Resume work on the interrupted README typo fix`; Proofwork selects the short recovery guide. Unknown scope needs inspection; behavior or security risk still raises the tier.

An interrupted check is not a pass. Recovery preserves the edit, reruns affected checks, respects pauses and reports unavailable verification with a concrete next action. A light follow-up cannot clear unresolved evidence or effects from an existing full run. See [light recovery](shared/skills/use-proofwork/references/light-recovery.md).

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
| Locate the code responsible for behavior | read-only investigate: identify the owner and trace callers |
| A slow page or unexplained latency | investigate with performance-increase: measure, diagnose and improve within the request |
| Review or simplify existing work | review/refactor with appropriate audit and maintainability guidance |
| Measured speed improvement | performance-increase with a representative baseline |
| Prepare an app for production | production-finish with actual hosting and release constraints |

You can enter at any stage. An accepted design does not need another brainstorming round; a focused bug fix does not need a new architecture. The root carries the brief forward and selects the next relevant skills within your request. It is an agent workflow, not a daemon intercepting unrelated prompts. Once a run is active, the checkpoint records the root mode and continuation instructions.

For example, “I want an app to track my invoices” starts with brainstorming. “The checkout page is slow, make it
faster” starts with investigation and performance guidance. “Which C file handles login?” is a light, read-only
investigation; naming a language does not automatically reopen architecture decisions.

Routing returns a **light**, **standard** or **full** tier. Small mechanical edits load a short procedure and relevant language entry. Behavioral or larger work loads shared implementation discipline and executable verification. Worker-only guidance is reserved for assigned workers. Security, concurrency, migrations, parallel work and audit-stack use full coordination. Automatic loading of the thermonuclear review lens applies only in full; substantial integrated work still receives independent review. Conditional references load when needed; the budget measures initial guidance, not total model usage.

Example request:

```text
Use Proofwork to fix the export. It sometimes loses the final page.
Keep the current file format and show me that the full document survives.
```

## Playbooks

The root selects a named procedure from your request. You can also say “Use Proofwork. Follow Repair Behavior to fix the export.” Playbooks are workflow names; invoke them through use-proofwork rather than a separate slash command.

| Playbook | Suggested tier |
| --- | --- |
| **Quick Fix** | light |
| **Clarify Path** | light |
| **Repair Behavior** | standard |
| **Add or Change Behavior** | standard |
| **Simplify Structure** | standard |
| **Improve Measurement** | standard |
| **Justify Structure** | full |
| **Harden and Finish** | full |
| **Coordinated Audit** | full |
| **Explore Options** | full |
| **Long Task** | full |
| **Shape Intent** | special |
| **Resume Work** | special |

Full-tier recommendations remain proportionate: bounded architecture advice or a small candidate comparison can stay standard. Explicit full-playbook requests select full coordination. Read-only intent and risk floors always apply. Explained routing exposes the selected guide and actual tier; [playbook details](docs/playbooks.md) describe handoffs, checkpoint compatibility and context costs.

## Skill commands

Version 0.19 renames `setup` → `pw-setup`, `worker-mode` → `pw-worker-mode`, and `clean-code` → `pw-clean-code`; update prompts or automation using the old names. Setup, workers and audit-stack are manually invoked. The root can deliberately read their guidance when needed.

Give any skill a task in the same prompt. In Codex, use `$<skill-name>` or select the Proofwork skill in the skills menu. In the Claude Code plugin, use `/proofwork:<skill-name>`. If another installed plugin has a skill with the same name, select the Proofwork entry explicitly. The root loads relevant guidance automatically; individual commands are useful for focused work.

| Codex invocation | Claude Code invocation | Use it for |
| --- | --- | --- |
| `$use-proofwork` | `/proofwork:use-proofwork` | Carry a task through discovery, routing, bounded workers, review and evidence. |
| `$explore-options` | `/proofwork:explore-options` | Compare two isolated prototypes against fixed acceptance, select with evidence and reverify integration. |
| `$trace-path` | `/proofwork:trace-path` | Explain actual execution, callers, mutable ownership and boundaries with file pointers. |
| `$origin-check` | `/proofwork:origin-check` | Investigate historical rationale and separate evidence from inference. |
| `$option-arena` | `/proofwork:option-arena` | Compare isolated parallel candidates, choose a base and reverify grafted strengths. |
| `$challenge-review` | `/proofwork:challenge-review` | Independently challenge correctness, security, maintainability, operations and residual risk. |
| `$clear-voice` | `/proofwork:clear-voice` | Clarify reports, comments and documentation without weakening technical meaning or evidence limits. |
| `$probe-first` | `/proofwork:probe-first` | Settle code-answerable uncertainty with a bounded disposable probe. |
| `$impact-map` | `/proofwork:impact-map` | Identify affected callers/contracts and verify preservation claims. |
| `$measure-loop` | `/proofwork:measure-loop` | Freeze a baseline and keep or reject attributable changes using measurements. |
| `$procedure-draft` | `/proofwork:procedure-draft` | Draft and validate an auditable procedure when existing workflows do not fit. |
| `$evidence-surface` | `/proofwork:evidence-surface` | Present rerunnable checks, artifact identities, observations and material gaps. |
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

## Context, exploration and delivery

The root selects guidance by stage. Explained routes expose `workflow.beforeWork`, `options`, `review` and `report`.
Trace Path prepares substantive existing-code changes; Origin Check investigates unusual constraints. Probe First uses
safe disposable checks for technical uncertainty. Option Arena extends explore-options with isolated parallel candidates,
usually two; a third requires explicit maxCandidates configuration and a distinct hypothesis. Impact Map and Challenge
Review feed findings and actual preservation checks into existing audit and acceptance workflows.

Measure Loop extends performance-increase with a fixed baseline and attributable keep/reject cycles. Procedure Draft
handles novel operations when existing workflows do not fit. Clear Voice applies to documentation, comments and final
reports; Evidence Surface connects claims to rerunnable checks and gaps. A typo fix still gets a short report, no ledger.

The initial-context budget counts selected entries, principles, preparation and options. Deferred review/report entry
words are reported separately and load when those stages are reached; references and actual model usage remain additional.
See the [context walkthrough](docs/context-worked-scenario.md) and [report example](docs/report-worked-example.md).
Both are illustrative, with no invented execution or performance results.

## Model roles, principles and alternatives

Run `$pw-setup` in Codex or `/proofwork:pw-setup` in Claude Code to configure repository-local model roles.
Proofwork supports implementer, reasoner, reviewer, challenger and writer roles, optional reasoning levels and
bounded candidate/review/concurrency budgets. Explicit observed model IDs override capability preferences. Without
configuration, roles inherit your session; `"modelRoles": {}` opts into capability selection from observed inventory.
No provider or model is presumed available. Setup merges `.proofwork.json` and preserves global defaults and credentials.

The [configuration guide](shared/skills/pw-setup/references/model-roles.md) includes an example. The read-only planner
is `node scripts/model-roles.mjs plan --repo . --host codex --inventory <observed-inventory.json>`; use `claude-code`
for that host. Unavailable models and unsupported reasoning are explicit gaps. Plans do not prove dispatch.
Token budgets are advisory unless host-enforced; coordinators bound scheduling and report unknown usage.

Use economical implementation where observed results support it, stronger reasoning for difficult tradeoffs, blind
reviewers for high-risk integration and challengers for costly failure assumptions. Two candidates can explore an
unresolved approach; two reviewers can inspect correctness and maintainability independently. Mechanical edits use
a direct path. Different brands do not establish independence, and combined candidate patches need fresh checks.
See [model patterns](shared/skills/use-proofwork/references/model-patterns.md) and
[comparison protocol](docs/model-role-evaluation.md). No multi-model quality gain has yet been demonstrated.

The root selects [seven decision references](docs/principles.md) when relevant. They are not separately callable
skills. Design economy combines the former simplicity, subtraction and component-justification rules; tier policy
owns proportionate effort. Explained routing exposes stable principle IDs and loadable reference paths.

`node scripts/proofwork.mjs route --explain --task "<outcome>"` reports tier reasons and selected principles.
Add `--tier light|standard|full` to override; reported security/concurrency and behavioral floors retain necessary
checks. Plain `route` preserves its JSON contract. The context budget counts selected principle files too.

Production-finish distinguishes local build, staging rehearsal and authorized live checks, with observability,
recovery, migration and secret-rotation guidance across static, serverless, container, VM and managed hosting.
Architecture and language choices require measurable fit. See [worked operational scenarios](docs/operational-scenarios.md);
these are illustrative procedures, not executed deployments.

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
| `node <plugin-root>/scripts/proofwork.mjs evidence --repo <repo> --run <id> --owner <session> --input <record.json> [--argv <check-argv.json> OR --command "<check>"] [--timeout-ms <milliseconds>]` | Execute a check with a two-minute default timeout and record actual exit/duration/digests, or record weaker manual evidence. |
| `node <plugin-root>/scripts/proofwork.mjs finding --repo <repo> --run <id> --owner <session> --input <record.json>` | Record or resolve a finding. |
| `node <plugin-root>/scripts/proofwork.mjs checkpoint --repo <repo> --run <id> --owner <session> --input <record.json>` | Save phase, revision, routing and next action. |
| `node <plugin-root>/scripts/proofwork.mjs complete --repo <repo> --run <id> --owner <session> --revision <identity>` | Check recorded completion gates; does not complete a native goal. |
| `node <plugin-root>/scripts/proofwork.mjs preflight --repo <repo> --run <id> --owner <session> --revision <identity>` | Read-only readiness JSON; inspect ready, not exit zero. |
| `node <plugin-root>/scripts/proofwork.mjs init … --host codex --session <host-session>` | Automatically bind a full run for optional lifecycle hooks; use actual host identity. |
| `node <plugin-root>/scripts/hook-binding.mjs bind\|unbind --repo <repo> --host codex --session <host-session> --run <id> --owner <owner>` | Recover a binding or deliberately detach a session. |
| `node <plugin-root>/scripts/check-commits.mjs --repo <repo> --range <outgoing-range>` | Check explicitly opted-in commit formatting; absent policy defaults to off. |
| `node <plugin-root>/scripts/check-coverage.mjs --report <report.json> --inventory <inventory.json> [--threshold 95..100]` | Enforce separate line/branch floors against an independently enumerated source target. |
| `node <plugin-root>/scripts/check-file-lines.mjs --repo <repo> [--limit <project-ceiling>] [--inventory <additional-code-paths.json>]` | Check an explicitly chosen project file-size policy; disabled by default. |
| `npm test` | Run the source repository's tests. |
| `npm run build` | Regenerate both packages. |
| `npm run build:hooks` | Build separate optional hook packages under `.engineering-team/hook-packages/`; installation and trust review are separate. |
| `npm run test:routing` | Check the routing corpus, Go/C false positives and language-choice behavior. |
| `npm run context-budget` | Check distinct trigger phrases, 600-word entries, 800-word references and initial guidance budgets. |
| `npm run check:coverage` | Run tests, collect real Node LCOV and enforce separate 95% gates. |
| `npm run check` | Check source width, context budgets, actual coverage, packaging and optional project policy. |

Run state binds observations to Git HEAD/tree, tracked file contents and nonignored untracked files. Non-Git folders
use a recursive inventory. Ignored dependencies, build output and caches do not invalidate Git snapshots; relevant
ignored source must be tracked or removed from ignore rules. Checkpoint after source changes. Executed evidence uses
`--command` because `--run` already names the coordination run. Manual evidence is marked `claimed` and blocks
completion unless `--allow-claimed` is explicit. A successful command still needs to prove its assigned criterion.
Workers and native goals remain host-managed.

Symlinks and junctions contribute their target string; changes to external target contents are outside the snapshot.
File hashing streams through at most eight workers per snapshot and caches hashes using size, modification/change
times and file identity. Local writer contention retries for 1.5 seconds. Locks record process birth as well as PID,
but unknown birth data remains protected; stale/remote recovery still requires explicit `--break-lock`.
Windows birth lookup uses an absolute executable with a fallback. Its lookup timeout can add up to three seconds
beyond the lock polling budget; unavailable or restricted process data remains unknown.

**Upgrading to 0.24.0 changes snapshot scope. Checkpoint existing runs and collect fresh evidence before completing them.**

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

Codex 0.30.0 is installed and enabled: 34 skill entries and seven conditional decision references. [Windows/Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38084811385) passes full checks and package parity. See the [consolidation record](evals/results/principle-consolidation-20261010.md). The preceding 0.29.0 installer verification is retained below. [Windows/Linux CI](https://github.com/zrmonty/proofwork/actions/runs/38084090159) passes full checks and package parity. Current 0.29 evidence is in the [systems-outcome record](evals/results/systems-outcomes-20261010.json). The [executed configuration repair](evals/examples/release-config/README.md) shows a public-safe before/after; [user-outcome evaluation](docs/user-outcome-evaluation.md) measures avoidable decisions, corrections, verified-slice time and feedback without inventing missing results. See [contributing](CONTRIBUTING.md) and the [opt-in feedback process](docs/early-user-feedback.md).

The initial guidance for the same TypeScript parser bug fell from **7,036 to 2,534 words** (about 64%). Conditional reference loading is additional; this does not establish model-token savings or agent quality. The comparative harness contains nine tasks and defaults to three repetitions per arm. Its actual pilot produced this result:

| Arm | Attempts | Completed implementations | Wall time | Input / output tokens reported by CLI | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| Bare | 1 | 0 | 21.00 s | 64,988 / 705 | Host blocked tools and writes; no files changed |
| Proofwork | 1 | 0 | 29.36 s | 120,426 / 899 | Same restriction; no files changed |
| Local reference profile | 0 | — | — | — | Comparison deferred after host failure |

These are blocked runs, not quality or performance scores. The expanded full 81-run comparison remains unfinished. See the [evaluation report](evals/results/improvement-evaluation.md) for measurement scope, claim review and host limitations, and the [harness](evals/ab/README.md) to run it on a supported host. Further skill additions must cite a motivating evaluation.

See [verification](docs/verification.md) for exact executed checks, behavioral observations, tested host versions, and unverified release gates. Packaging tests establish packaging behavior; they do not certify agent quality or subjective visual appeal. The run-state guard enforces its recorded evidence contract, not truthfulness of arbitrary input supplied by an operator.

Historical source version **0.28.0**, the full check passes with **98.75% line coverage and 97.27% branch coverage**
across 19 runtime scripts. Both host packages contain 49 skills and 13 named playbooks; Codex 0.28.0 is installed
and enabled. The same 92-case corpus now loads **158,304 initial words**, down from 169,692 (6.71%).
Selected guides and required resume guidance count initially; another 14,790 entry words are deferred.
This is an instruction-word measure, not measured token savings or agent quality. See [current checks](evals/results/integrated-flow-20261010.json).
[Windows/Linux CI](https://github.com/zrmonty/proofwork/actions/runs/38082851449) passes source checks, both package builds and generated-package parity.
It runs on main pushes, pull requests and manual dispatch.

In the historical 0.24 snapshot regression, a standalone Windows Git worktree with 20,000 ignored files fell from **5,036 ms
to 129 ms**, excluding fixture setup and cleanup. These individual measurements do not establish performance on
every repository or host. See the [snapshot evidence](evals/results/git-snapshot-20261010.json).

Standard packages contain no lifecycle hook configuration. Optional recovery, routing and completion hooks are built
separately with `npm run build:hooks`; see [setup and limits](docs/hooks.md). They require the host's supported
installation and trust flow. Full-run init binds a supplied actual host/session automatically. No global hooks are
installed automatically. Root invocation uses the host's
existing agent and tools. User authorization and project instructions govern work.

SessionStart restores a bound run and UserPromptSubmit supplies routing hints. Stop checks recorded readiness for
reviewing/verifying runs regardless of wording, with a recursion guard. Missing fields produce an advisory; without
a valid recursion flag, Stop is allowed to avoid looping. Checkpoint awaiting/stopped work before an incomplete
final report. Native Claude SessionStart and UserPromptSubmit have been observed; authentication prevented a model
response and native Stop verification. Codex native hook dispatch and host timeout behavior remain unverified.

## Development

Contributor routing check: `npm run test:routing`. It covers 92 scenarios plus the focused
[50-prompt Go/C corpus](tests/language-routing-corpus.json), with 159 checks in total. Ordinary go/C wording must
not reopen technology choice; genuine choices must still route correctly. These checks also run in `npm test`
and `npm run check`. See [snapshot scope](shared/contracts/tool-interface.md#snapshot-scope-and-caching) for the
inventory, caching and upgrade contract.

Executed evidence commands have a two-minute default deadline; use `--timeout-ms` for an explicit override.
They run with inherited permissions. Allowlisting the Proofwork launcher also grants child shell execution unless
the host restricts descendants; see [command authority and deadlines](shared/contracts/tool-interface.md#executed-command-authority-and-deadlines).
Exported evidence uses placeholders for private paths/account identifiers. Automation commits retain an explicit
automation identity; see [authorship and export policy](docs/decisions/git-authorship-and-exported-evidence.md).

Edit `shared/` and the relevant `adapters/`; rebuild both packages from canonical authored assets. Each skill has a [specification](docs/skill-specs/) and scenario coverage. Use disposable repositories for lifecycle and integration tests. Never edit generated package copies as the source of a fix.

Skill entry files carry the essential decisions and operating constraints. Their linked `references/` contain focused worked examples, specialist guidance and review procedures; each entry explains when to read them. The root selects relevant skills, and those skills load the detail the task needs. See the [skill depth and evaluation standard](docs/skill-depth-review.md) for authoring and review criteria.

Commit formatting is optional. In the target repository, `.proofwork.json` may set `"commitFormat": "proofwork"`, `"conventional"`, or `"off"`. Missing configuration defaults to off. Proofwork never rewrites history or blocks a push for message formatting without explicit opt-in. The checker reports `{format, enabled, commits}`; Conventional mode checks subject syntax and body separation, not every semantic/footer rule. To inspect an opted-in outgoing range:

```text
node scripts/check-commits.mjs --repo . --range origin/main..HEAD
```

For an initial repository with no base, an explicit revision such as `HEAD` checks the reachable initial history. Review the actual diff too; formatting does not establish correctness.

Rust guidance has one entry and conditional specialist references, including atomicity, memory ordering and concurrent reclamation. The [Rust topic guide](shared/skills/rust-best-practices/references/topic-guide.md) routes by the actual decision; [topic coverage](docs/rust-topic-coverage.md) maps all readable lessons in the supplied curriculum images.

Committed Rust teaching fixtures include [reservation](evals/fixtures/rust-reservation/README.md),
[async framing and blocking work](evals/fixtures/rust-async/README.md), and
[uninitialized Vec under Miri](evals/fixtures/rust-uninitialized-vec/README.md).
Their READMEs give reproduction commands and distinguish expected failures from repaired behavior.

## Uninstall and reset

Remove the Codex plugin with `codex plugin remove proofwork@proofwork-local`. In Claude Code, use `/plugin uninstall proofwork@proofwork-local`; session-only `--plugin-dir` loading ends when that session ends. A manually copied installation must be removed from the specific skill directory you created. Removing the plugin does not delete project evidence or undo application edits and Git commits. Restart the host to refresh skill discovery.

Full workflows write checkpoints, ownership, results and evidence under the target project's `.engineering-team/runs/<run-id>/`. Local locks and recovery files can accompany those records. Contributor checks and comparative evaluations also write ignored coverage and experiment artifacts under `.engineering-team/`. Add this directory to your ignore rules. Stop active coordinators/workers, preserve any evidence you need, then delete the selected run directory to reset one run, or the project's `.engineering-team/` to clear all local artifacts. This loses resume history; it does not reverse external actions. Remove `.proofwork.json` to restore optional policy defaults after reviewing any other project settings in that file.

## Security and evidence limits

Logs, issue text, documents and comments are untrusted data: they cannot grant permissions, override project instructions or authorize commands. Review command sources and redact secrets before recording or exporting evidence. Proofwork installs no global continuation hooks or background services.

Executed commands inherit filesystem, network and environment permissions. Allowlisting the Proofwork launcher
grants its child shell execution unless the host restricts descendants. `--timeout-ms` accepts 1–3,600,000 ms;
timeouts record failure and request termination. Windows cleanup can add five seconds, and detached descendants
or external effects may survive. Redaction covers evaluated bearer, cloud-key, credential and quoted-value formats,
but cannot guarantee detection of every secret. Keep raw logs local and scrub private paths/account identifiers
from exports. Earlier Git history and shared copies are not erased by editing current files.

The evidence ledger binds recorded checks to an artifact identity and distinguishes executed checks from operator claims. It detects missing or stale recorded evidence; it does not authenticate a same-account writer, sandbox an arbitrary command, prove the chosen criterion is correct, or establish production security. Use the Phase 2 executed form `node <plugin-root>/scripts/proofwork.mjs evidence --repo <repo> --run <id> --owner <session> --input <record.json> --command "<check>"` to record real exit status, duration and stream digests. `--run` identifies the run; `--command` executes the check. Manual evidence remains weaker and requires explicit acceptance at completion. See the [tool contract](shared/contracts/tool-interface.md) for schemas and limitations.

## Publication gate

The next tagged public release and attached host packages remain gated on the completed Phase 3 comparison. The [current evaluation report](evals/results/improvement-evaluation.md) records two unusable pilot attempts and no completed original 72-run experiment; the expanded nine-task suite would have 81 rows. Package checks and smaller instructions do not substitute for agent-quality results. Build locally with `npm run build`; publish a tag and attach both built host packages only after that experiment yields usable results.
