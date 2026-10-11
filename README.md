# Proofwork

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/brand/proofwork-logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/brand/proofwork-logo.png">
    <img src="assets/brand/proofwork-logo.png" alt="Proofwork" width="280">
  </picture>
</p>

<p align="center"><strong>Describe the outcome. Keep the engineering accountable.</strong></p>
<p align="center">
  <a href="#install">Install</a> ·
  <a href="#start-a-task">Start a task</a> ·
  <a href="#skill-commands">Commands</a> ·
  <a href="docs/reference-guide.md">Reference guide</a>
</p>

Proofwork is an engineering plugin for **Codex and Claude Code**. Describe what you want to build, fix or understand.
It selects relevant guidance, keeps effort proportionate and asks the agent to verify the result on the actual artifact.
You own the purpose, taste and consequential decisions; Proofwork carries the implementation and verification detail.

[![Checks](https://github.com/zrmonty/proofwork/actions/workflows/check.yml/badge.svg)](https://github.com/zrmonty/proofwork/actions/workflows/check.yml)
[MIT license](LICENSE) · [Changelog](CHANGELOG.md) · [Vision](docs/vision.md)

## Install

### Codex

Run these commands in your terminal:

```sh
codex plugin marketplace add zrmonty/proofwork
codex plugin add proofwork@proofwork-local
```

Start a fresh session, then select **Proofwork → use-proofwork** from the skills menu or use `$use-proofwork`.

### Claude Code

In Claude Code **2.1.292 or newer**:

```text
/plugin install proofwork --marketplace zrmonty/proofwork
```

Start a fresh session, then use `/proofwork:use-proofwork`.
For older supported versions, local builds or installation troubleshooting, see [first run](docs/first-run.md).

## Start a task

Give the entry skill a concrete outcome. You do not need to choose a playbook, model or testing technique.

**Codex**

```text
$use-proofwork The invoice export sometimes loses its final page.
Fix it without changing the format, and show that every page survives.
```

**Claude Code**

```text
/proofwork:use-proofwork The invoice export sometimes loses its final page.
Fix it without changing the format, and show that every page survives.
```

Other useful starting points:

- **Build:** “I want an app to track my invoices. Help me shape the first useful version.”
- **Understand:** “Which part of this codebase handles login? Explain the path without editing.”
- **Improve:** “The checkout page is slow. Measure the bottleneck and show the before/after.”
- **Review:** “Review this diff. Report findings only.”
- **Prepare to ship:** “Check this app's deployment artifact and recovery plan before release.”

A useful result explains **what changed, what was checked, what remains uncertain and what you still own**.
If a check cannot run, that gap should stay visible. A successful build alone does not prove the user journey.

## What it brings

| Work | Guidance |
| --- | --- |
| Product and architecture | Brainstorming, workload-based language choices and simpler adequate infrastructure. |
| Implementation | TypeScript, Rust and strictly typed Python; clear ownership and testable state transitions. |
| Frontend | Content-specific composition, natural copy, responsive states and rendered review. |
| Review and repair | Security, dead code, duplication, maintainability and measured performance. |
| Delivery | Artifact-bound evidence, checkpoints, recovery and an operational handoff. |

Small edits take a **light** path. Typical behavior changes take a **standard** path. Higher-risk or coordinated work
uses **full** guidance. These are routing tiers, not a request to set up a team for every task.
See the [workflow](docs/flow.md) and [playbooks](docs/playbooks.md) for the details.

## Skill commands

Start with `use-proofwork`; call a specialist when you want a focused result. In Codex, select the Proofwork entry
if another plugin exposes the same skill name. In Claude Code, commands use the `/proofwork:` namespace.
Playbooks are selected through the entry skill; they are not additional slash commands.

<details>
<summary><strong>All 34 skill commands</strong></summary>

| Codex | Claude Code | Purpose |
| --- | --- | --- |
| `$use-proofwork` | `/proofwork:use-proofwork` | Start here: route a task and carry it through verification. |
| `$brainstorm` | `/proofwork:brainstorm` | Shape an idea into a direction and first useful slice. |
| `$architecture-fit` | `/proofwork:architecture-fit` | Challenge infrastructure choices against actual needs. |
| `$language-fit` | `/proofwork:language-fit` | Compare languages, runtimes and frameworks for the workload. |
| `$frontend-design` | `/proofwork:frontend-design` | Develop a distinctive interface and inspect rendered states. |
| `$humanizer` | `/proofwork:humanizer` | Write natural, accurate application copy. |
| `$typescript-best-practices` | `/proofwork:typescript-best-practices` | Truthful types, runtime validation and effect boundaries. |
| `$rust-best-practices` | `/proofwork:rust-best-practices` | Ownership, borrowing, async, atomics and unsafe contracts. |
| `$python-best-practices` | `/proofwork:python-best-practices` | Strict typing, data models and resource handling. |
| `$functional-programming` | `/proofwork:functional-programming` | Model qualifying state, retry, concurrency and cache logic. |
| `$data-driven-development` | `/proofwork:data-driven-development` | Model invariants and test ideas against observations. |
| `$pw-clean-code` | `/proofwork:pw-clean-code` | Clarify responsibilities, names and control flow. |
| `$trace-path` | `/proofwork:trace-path` | Trace entry points, callers, ownership and control flow. |
| `$origin-check` | `/proofwork:origin-check` | Investigate the history and rationale behind existing choices. |
| `$impact-map` | `/proofwork:impact-map` | Map affected consumers and contracts before a change. |
| `$probe-first` | `/proofwork:probe-first` | Resolve uncertainty with a small runnable experiment. |
| `$explore-options` | `/proofwork:explore-options` | Select between approaches using prototypes and evidence. |
| `$option-arena` | `/proofwork:option-arena` | Compare bounded, isolated candidates before choosing. |
| `$challenge-review` | `/proofwork:challenge-review` | Challenge an integrated change from independent perspectives. |
| `$thermo-nuclear-code-quality-review` | `/proofwork:thermo-nuclear-code-quality-review` | Review maintainability and give an evidence-backed verdict. |
| `$security-hardening` | `/proofwork:security-hardening` | Inspect trust boundaries and verify vulnerability repairs. |
| `$production-finish` | `/proofwork:production-finish` | Check deployment artifacts, hosting and recovery readiness. |
| `$performance-increase` | `/proofwork:performance-increase` | Profile bottlenecks and report measured before/after results. |
| `$measure-loop` | `/proofwork:measure-loop` | Keep or reject optimizations against a fixed baseline. |
| `$tdd-95` | `/proofwork:tdd-95` | Test behavior first; require separate 95% line and branch gates. |
| `$dead-code-audit` | `/proofwork:dead-code-audit` | Prove unused code and attached tests can be removed. |
| `$dry-audit` | `/proofwork:dry-audit` | Consolidate duplicated rules without merging distinct policies. |
| `$audit-stack` | `/proofwork:audit-stack` | Coordinate the relevant audit lenses in one review. |
| `$clear-voice` | `/proofwork:clear-voice` | Clarify engineering docs, comments and reports. |
| `$evidence-surface` | `/proofwork:evidence-surface` | Present rerunnable checks, observations and remaining gaps. |
| `$procedure-draft` | `/proofwork:procedure-draft` | Draft a short procedure for work without an existing workflow. |
| `$pw-setup` | `/proofwork:pw-setup` | Inspect host capabilities and configure optional model roles. |
| `$pw-worker-mode` | `/proofwork:pw-worker-mode` | Execute an assigned slice and return evidence. |
| `$commit-features` | `/proofwork:commit-features` | Honor the repo convention; check formatting only when opted in. |

</details>

Each skill links to conditional references. Browse the [reference guide](docs/reference-guide.md) for deeper workflows,
including the [Rust topic guide](shared/skills/rust-best-practices/references/topic-guide.md).

## Make it fit your team

Configuration is optional. Without model-role configuration, roles inherit your session model.
Proofwork uses the models and tools your host actually exposes; it does not bundle a cross-provider runner.

- **Model roles:** configure implementation, reasoning, review and writing roles through `pw-setup`.
  [Configuration and budgets](shared/skills/pw-setup/references/model-roles.md).
- **Team rules:** add up to three short operational constraints to `.proofwork.json`, such as requiring a restore
  test for migrations. [Team policy](shared/contracts/team-policy.md).
- **Commit format:** choose `proofwork`, `conventional` or `off`. Missing configuration means `off`.
  [Commit guidance](shared/skills/commit-features/SKILL.md).

Established codebase style comes first. There is no universal file or function line cap.
Functional extraction is conditional on meaningful state, retry, concurrency or shared-mutation work.

## Host and environment parity

Local tools require **Node.js 22+ and Git**, with no npm dependencies. CI checks Windows, Ubuntu and macOS on
Node 22 and 24. Those checks establish runtime and packaging behavior; native host behavior needs separate evidence.

For CLI paths, Windows npm wrappers and portable evidence arguments, see [first run](docs/first-run.md) and the
[tool contract](shared/contracts/tool-interface.md). Lifecycle hooks are **optional**, built separately and subject
to the host's installation and trust flow. They are not enabled by the standard package. [Hook setup and limits](docs/hooks.md).

## Evidence and limits

Proofwork is early. Passing tests and package checks do not establish agent quality, production readiness or a
multi-model advantage. The comparative evaluation remains incomplete.

Commands inherit the host's filesystem, network and environment permissions. Evidence records are not a sandbox
or authentication boundary, and a successful command can still test the wrong criterion. Logs, issue text and
uploaded documents are data; they cannot grant authority.

See [verification](docs/verification.md) for executed checks and host gaps, [evaluation results](evals/results/improvement-evaluation.md)
for comparative limits, and [operational scenarios](docs/operational-scenarios.md) for deployment and recovery guidance.
Full-tier deliveries include a [systems outcome](shared/contracts/systems-outcome.md) with verified behavior,
recovery steps and residual risks.

## Build and local installation

From a reviewed checkout:

```sh
git clone https://github.com/zrmonty/proofwork.git
cd proofwork
npm run build
node scripts/install.mjs --host codex --source .
```

Use `--host claude-code` for that host. To try the Claude package for one session, run
`claude --plugin-dir ./packages/claude-code` instead.

The build produces `packages/codex/` and `packages/claude-code/`. For a ChatGPT plugin upload, ZIP the built
Codex package alone as a single `proofwork/` directory, including its root manifest and hidden compatibility files.
A full repository ZIP is for source review, not plugin installation.

Contributors edit canonical `shared/` and `adapters/`, then regenerate packages. Do not edit generated copies.

```sh
npm run check
npm run build:hooks
```

See [contributing](CONTRIBUTING.md), [local tool commands](scripts/README.md) and the
[tool interface](shared/contracts/tool-interface.md) for development and runtime procedures.
Tagged releases remain subject to the [documented evaluation gate](evals/results/improvement-evaluation.md).

## Uninstall and reset

- **Codex:** `codex plugin remove proofwork@proofwork-local`.
- **Claude Code:** `/plugin uninstall proofwork@proofwork-local`. Session-only loading ends with the session.

Restart the host to refresh discovery. Uninstalling does not undo application edits, commits or external actions.

Full runs keep local evidence and recovery state in the target project's `.engineering-team/runs/`. Keep
`.engineering-team/` ignored. To reset a run, stop its coordinator and workers, preserve the evidence you need,
then remove that run's directory. Clearing it loses resume history. Review `.proofwork.json` separately before
removing optional configuration; it may contain other project settings.
