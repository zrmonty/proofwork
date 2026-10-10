# Proofwork runtime

## Entry and discovery

Start a local session with `claude --plugin-dir <absolute-path-to-packages/claude-code>`, then invoke `/proofwork:use-proofwork <task>`. Claude namespaces plugin skills; the package does not promise a bare `/use-proofwork` alias. The root skill loads setup, routing and relevant guidance automatically. No user-wide configuration or hooks are installed. Validate with `claude plugin validate <package-path>` when that CLI is available.

## Shell, subagents and browser capabilities

Discover live delegation tools, shell access and browser integrations. Use supported subagents for bounded independent assignments, with explicit ownership, acceptance criteria, selected bundled skills and result contracts. Do not invent native team features when only ordinary subagents are exposed. A worker reads its assigned skills independently. The coordinator alone records aggregate checkpoints and integrates results. Overlapping edits require isolated checkouts and sequential integration.

## Models and evidence

Keep the session model by default. Configured role models must be supported by the actual Claude host; report unavailable mappings before dispatch. Cross-provider workers need an external bridge and are outside this package. Use [goal lifecycle](goal.md), [CLI control](control-cli.md), [browser control](control-ui.md), and [checkpoint interface](../scripts/README.md).

## Model-role dispatch

Run `node <plugin>/scripts/model-roles.mjs plan --repo <project> --host claude-code --inventory <inventory.json>`.
Supply an observed inventory array with `id`, `strengths`, supported `reasoning` levels and `available` for each model.
Without `.proofwork.json` `modelRoles`, all roles inherit. An explicit empty object opts into capability selection;
role overrides contain `model` and `reasoning`. Read each role's `requested`, `resolved` and `capabilityMissing`;
never dispatch unresolved roles. Sibling `modelBudgets` limits candidates, reviewers, parallel workers and optional
tokens. The plan does not execute workers or enforce budgets; the coordinator must enforce available limits.

Use the observed Agent tool's per-invocation `model` parameter or an authorized session-local subagent definition.
Claude supports model aliases and full provider model IDs; aliases can resolve differently across accounts and
providers. Do not translate a Codex model ID into an assumed Claude equivalent. Map resolved reasoning to `effort`
only when the current tool, version and selected model support it; omit inherited fields. Per-invocation effort
requires Claude Code 2.1.292 or later. Managed allowlists or environment overrides can substitute models or effort.
Inspect warnings and `/tasks` where available; record the actual resolved ID/effort or `unknown`, and report a
substitution instead of silently accepting it. Preserve global settings and environment.
See [official subagent model and effort selection](https://code.claude.com/docs/en/sub-agents).

Use a non-fork reviewer with fresh context: acceptance criteria, the actual diff and verification artifacts.
Omit the implementer's persuasive rationale. Distinct aliases do not establish distinct underlying models, and
distinct models do not establish independent review; evaluate findings against the code and tests.

## Installation and host contract

Source: https://code.claude.com/docs/en/plugins-reference . Manifest is `.claude-plugin/plugin.json`, skills live in `skills/<name>/SKILL.md` and invocation is namespaced. Host behavior still requires real-session evaluation.

## Invocation policy

For a manual-only skill, Claude Code supports `disable-model-invocation: true` in SKILL.md frontmatter. Explicit namespaced user invocation remains available; the setting also prevents skill preloading into subagents. Keep this host-specific field out of the canonical body and other host packages. `user-invocable: false` has a different purpose: it hides the user command while retaining model invocation. See [official skill configuration](https://code.claude.com/docs/en/skills).

Standard packages contain no lifecycle configuration. The separately built opt-in package puts host hooks in
`hooks/hooks.json` and shared handlers in `scripts/`. Review and install through the host's supported trust flow.
SessionStart recovers an explicitly bound run; UserPromptSubmit recommends a route; Stop performs read-only
completion preflight in reviewing/verifying regardless of wording, with a recursion guard. Supply actual host/session
identity to `init --host claude-code --session ID` for automatic binding. Checkpoint awaiting/stopped before an incomplete
report. Missing Stop fields produce an advisory. Never infer a newest run or restart stopped work.
