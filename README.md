# Proofwork

An engineering workflow plugin for Codex and Claude Code. Give it a task; its entry skill selects a playbook, loads the relevant language and design skills, coordinates bounded workers when useful, and checks the integrated result against evidence.

Proofwork aims to help a team write less, better code. All shipped instructions are originally authored to [our specification](docs/superpowers/specs/2026-10-10-proofwork-design.md). Pstack and Impeccable informed capability discussions; neither is a runtime dependency and no existing skill files were imported or adapted.

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

## Build and local installation

Requires Node.js 22 or newer for the local tools. No npm dependencies are required.

```text
npm test
npm run build
```

Build writes `packages/codex/` and `packages/claude-code/`. Each contains the shared authored skills, relevant host adapter, playbooks, contracts, and local tools. Build validates bundled references. Run-state artifacts live in the target project's `.engineering-team/runs/`, not in the plugin package.

For Codex, this repository contains a local marketplace entry and repo-scoped plugin configuration. From a trusted checkout, use the available plugin discovery/install UI or CLI to select `proofwork@proofwork-local`. See [Codex adapter](adapters/codex/runtime.md) for actual commands and any tested limitations. Do not overwrite personal config to install the package.

For Claude Code, load the built package for the session:

```text
claude --plugin-dir ./packages/claude-code
```

Then invoke `/proofwork:use-proofwork`. For persistent installation from GitHub:

```text
/plugin marketplace add zrmonty/proofwork
/plugin install proofwork@proofwork-local
```

The repository includes a Claude marketplace pointing to the built package. See [Claude adapter](adapters/claude-code/runtime.md).

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

Commit messages use the built-in format check:

```text
node scripts/check-commits.mjs --repo . --range origin/main..HEAD
```

For an initial repository with no base, an explicit revision such as `HEAD` checks the reachable initial history. Review the actual diff too; formatting does not establish correctness.
