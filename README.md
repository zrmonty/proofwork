# Proofwork

An engineering workflow plugin for Codex and Claude Code. Give it a task; its entry skill selects a playbook, loads the relevant language and design skills, coordinates bounded workers when useful, and checks the integrated result against evidence.

Proofwork aims to help a team write less, better code. All shipped instructions are originally authored to [our specification](docs/design/2026-10-10-proofwork-design.md). No existing skill files were imported or adapted.

**Hard code-file limit: 500 physical lines.** Exactly 500 is allowed; 501 is a violation. Implementation, tests, scripts, generated application code and existing oversized files follow the same rule. Split cohesive responsibilities rather than compressing code or hiding files. The implementation, review and root workflows enforce this requirement; `npm run check:file-lines` checks this repository, and `npm run check` includes it after building.

## Start

The root is **use-proofwork**. Supported command spelling depends on the host:

- Codex: select `use-proofwork` from the skills menu, or invoke `$use-proofwork` in your prompt. Available slash-menu labels are controlled by Codex.
- Claude Code plugin: `/proofwork:use-proofwork <task>`.
- Claude Code standalone skill, if deliberately installed in the project's `.claude/skills/use-proofwork/`: `/use-proofwork <task>`. The rest of the package must remain available at the relative paths described in the installation section; copying only the root file is insufficient.

The entry skill automatically invokes the bundled router and reads the selected guidance. It is an agent workflow, not a daemon intercepting unrelated prompts. Once a run is active, the checkpoint records the root mode and continuation instructions.

Example request:

```text
Use Proofwork to fix the interrupted export. Reproduce it first, preserve the
existing file format, and prove the final page survives. Use independent review.
```

## Skill commands

Give any skill a task in the same prompt. In Codex, use `$<skill-name>` or select the Proofwork skill in the skills menu. In the Claude Code plugin, use `/proofwork:<skill-name>`. If another installed plugin has a skill with the same name, select the Proofwork entry explicitly. The root loads relevant guidance automatically; individual commands are useful for focused work.

| Codex invocation | Claude Code invocation | Use it for |
| --- | --- | --- |
| `$use-proofwork` | `/proofwork:use-proofwork` | Carry a task through discovery, routing, bounded workers, review and evidence. |
| `$setup` | `/proofwork:setup` | Inspect host capabilities, toolchains, model roles and repository checks. |
| `$architecture-fit` | `/proofwork:architecture-fit` | Challenge every major stack component, compare simpler adequate alternatives and justify tools from real requirements. |
| `$production-finish` | `/proofwork:production-finish` | Prepare an app for production, inspect secret exposure, establish hosting and build a suitable container when needed. |
| `$performance-increase` | `/proofwork:performance-increase` | Profile bottlenecks, improve measured runtime/resource use and reduce benchmark overhead without changing the workload. |
| `$tdd-95` | `/proofwork:tdd-95` | Use test-first development with separate 95% line/branch gates and consolidate redundant tests while preserving fault detection. |
| `$worker-mode` | `/proofwork:worker-mode` | Execute a bounded assignment and return a reviewable result. |
| `$thermo-nuclear-code-quality-review` | `/proofwork:thermo-nuclear-code-quality-review` | Audit maintainability and report concrete structural findings with a verdict. |
| `$typescript-best-practices` | `/proofwork:typescript-best-practices` | Apply TypeScript guidance to types, validation, effects and tests. |
| `$rust-best-practices` | `/proofwork:rust-best-practices` | Apply Rust guidance to ownership, errors, boundaries and verification. |
| `$python-best-practices` | `/proofwork:python-best-practices` | Apply Python guidance to data models, boundaries, resources and tests. |
| `$functional-programming` | `/proofwork:functional-programming` | Keep domain decisions pure and make state transitions and effects explicit. |
| `$data-driven-development` | `/proofwork:data-driven-development` | Model invariants and evaluate changes using observed data and repeatable checks. |
| `$clean-code` | `/proofwork:clean-code` | Simplify demonstrated complexity while preserving behavior and safety guards. |
| `$frontend-design` | `/proofwork:frontend-design` | Develop an original visual direction, iterate and verify rendered interfaces. |
| `$humanizer` | `/proofwork:humanizer` | Write natural application copy, simplify unnecessary headings and footer content, and keep interaction wording accurate. |
| `$security-hardening` | `/proofwork:security-hardening` | Audit trust boundaries, fix supported vulnerabilities and verify repairs with safe adversarial regression checks. |
| `$dead-code-audit` | `/proofwork:dead-code-audit` | Remove proven dead code and exclusively attached tests, then verify surviving behavior and runtime entry points. |
| `$commit-features` | `/proofwork:commit-features` | Prepare truthful Major features / Minor features commit sections and check outgoing history. |

Examples for Codex:

```text
$use-proofwork Find and fix issues in this repository. Reproduce bugs first and use independent review.
$thermo-nuclear-code-quality-review Review the current diff and its callers. Report findings without editing.
$frontend-design Refine the article page with a content-led editorial identity and verify desktop/mobile behavior.
$humanizer Rewrite this application's copy in a natural, direct voice. Reduce repetitive headings and footer sections while preserving useful navigation, facts and behavior.
$commit-features Prepare a commit message from the staged diff and check the outgoing history.
$architecture-fit Challenge this proposed stack. Explain why each major tool is needed, recommend simpler adequate alternatives and omit unearned complexity.
$production-finish Prepare this app for production. Check for exposed secrets, ask about hosting and build a Docker image if it fits.
$performance-increase Improve this parser's throughput and shorten its benchmark run. Preserve correctness and report comparable measurements.
$tdd-95 Implement the approved behavior test-first, enforce the 95% coverage gate and consolidate redundant test setup and cases.
$security-hardening Audit and harden this app. Trace reachable vulnerabilities, fix shared causes, preserve legitimate behavior and report verification gaps.
$dead-code-audit Find and remove dead code and its exclusively attached tests. Check dynamic entry points, public contracts and shared fixtures before deletion.
```

For Claude Code, replace the skill token with its namespaced command, for example `/proofwork:use-proofwork Find and fix issues in this repository`. `/use-proofwork` is the product entry name; a bare slash alias depends on host installation and is not guaranteed by the plugin. Commands reuse the host's available tools and permissions. Invoking a review or commit skill alone does not authorize edits, pushing or publishing.

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
| `node <plugin-root>/scripts/proofwork.mjs evidence --repo <repo> --run <id> --owner <session> --input <record.json>` | Record an observation and hash its artifact. |
| `node <plugin-root>/scripts/proofwork.mjs finding --repo <repo> --run <id> --owner <session> --input <record.json>` | Record or resolve a finding. |
| `node <plugin-root>/scripts/proofwork.mjs checkpoint --repo <repo> --run <id> --owner <session> --input <record.json>` | Save phase, revision, routing and next action. |
| `node <plugin-root>/scripts/proofwork.mjs complete --repo <repo> --run <id> --owner <session> --revision <identity>` | Check recorded completion gates; does not complete a native goal. |
| `node <plugin-root>/scripts/check-commits.mjs --repo <repo> --range <outgoing-range>` | Check outgoing feature sections. |
| `node <plugin-root>/scripts/check-coverage.mjs --report <report.json> --inventory <inventory.json> [--threshold 95..100]` | Enforce separate line/branch floors against an independently enumerated source target. |
| `node <plugin-root>/scripts/check-file-lines.mjs --repo <repo> [--inventory <additional-code-paths.json>]` | Reject project code files above 500 physical lines; add custom or ignored code paths to discovery. |
| `npm test` | Run the source repository's tests. |
| `npm run build` | Regenerate both packages. |
| `npm run check` | Run tests followed by the build. |

Use an identity that includes current content: a clean commit or a recorded snapshot/digest for a dirty checkout. These tools store run state; they do not themselves run tests, spawn agents or establish truth from a supplied `passed` record.

## Included guidance

- Team root, worker discipline, setup, and task playbooks for investigation, bug fixes, features, refactoring, and reviews.
- TypeScript, Rust, and Python practices selected by task/files.
- Functional programming as the default: pure decisions, explicit state transitions, effects at boundaries, and clear language-native code.
- Data-driven development and clean code: model invariants, measure meaningful changes, remove unnecessary mechanisms, and test observed behavior.
- Frontend design: content-specific editorial identity, coherent softer shapes, accessible responsive behavior, meaningful visual iteration, and rendered evidence.
- Thermonuclear maintainability review: concrete opportunities to simplify structure, strict scope/evidence rules, and an explicit verdict.
- Commit features: every newly authored outgoing commit includes Major features and Minor features sections, with truthful validation and gaps.

Model roles use actual host capabilities and user-selected settings. Native alternatives are supported where available; mixed-provider routing requires an explicit external bridge and is not bundled. Shell execution and available browser control are reused. Missing capability is reported, never simulated.

## Verification and limits

See [verification](docs/verification.md) for exact executed checks, behavioral observations, tested host versions, and unverified release gates. Packaging tests establish packaging behavior; they do not certify agent quality or subjective visual appeal. The run-state guard enforces its recorded evidence contract, not truthfulness of arbitrary input supplied by an operator.

The plugin has no global hook installation, external publishing automation, credential store, model API client, or background scheduler. Root invocation uses the host's existing agent and tools. User authorization and project instructions govern work.

## Development

Edit `shared/` and the relevant `adapters/`; rebuild both packages from canonical authored assets. Each skill has a [specification](docs/skill-specs/) and scenario coverage. Use disposable repositories for lifecycle and integration tests. Never edit generated package copies as the source of a fix.

Skill entry files carry the essential decisions and operating constraints. Their linked `references/` contain focused worked examples, specialist guidance and review procedures; each entry explains when to read them. The root selects relevant skills, and those skills load the detail the task needs. See the [skill depth and evaluation standard](docs/skill-depth-review.md) for authoring and review criteria.

Commit messages use the built-in format check:

```text
node scripts/check-commits.mjs --repo . --range origin/main..HEAD
```

For an initial repository with no base, an explicit revision such as `HEAD` checks the reachable initial history. Review the actual diff too; formatting does not establish correctness.
