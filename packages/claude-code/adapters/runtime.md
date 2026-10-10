# Proofwork runtime

## Entry and discovery

Start a local session with `claude --plugin-dir <absolute-path-to-packages/claude-code>`, then invoke `/proofwork:use-proofwork <task>`. Claude namespaces plugin skills; the package does not promise a bare `/use-proofwork` alias. The root skill loads setup, routing and relevant guidance automatically. No user-wide configuration or hooks are installed. Validate with `claude plugin validate <package-path>` when that CLI is available.

## Shell, subagents and browser capabilities

Discover live delegation tools, shell access and browser integrations. Use supported subagents for bounded independent assignments, with explicit ownership, acceptance criteria, selected bundled skills and result contracts. Do not invent native team features when only ordinary subagents are exposed. A worker reads its assigned skills independently. The coordinator alone records aggregate checkpoints and integrates results. Overlapping edits require isolated checkouts and sequential integration.

## Models and evidence

Keep the session model by default. Configured role models must be supported by the actual Claude host; report unavailable mappings before dispatch. Cross-provider workers need an external bridge and are outside this package. Use [goal lifecycle](goal.md), [CLI control](control-cli.md), [browser control](control-ui.md), and [checkpoint interface](../scripts/README.md).

## Installation and host contract

Source: https://code.claude.com/docs/en/plugins-reference . Manifest is `.claude-plugin/plugin.json`, skills live in `skills/<name>/SKILL.md` and invocation is namespaced. Host behavior still requires real-session evaluation.

## Invocation policy

For a manual-only skill, Claude Code supports `disable-model-invocation: true` in SKILL.md frontmatter. Explicit namespaced user invocation remains available; the setting also prevents skill preloading into subagents. Keep this host-specific field out of the canonical body and other host packages. `user-invocable: false` has a different purpose: it hides the user command while retaining model invocation. See [official skill configuration](https://code.claude.com/docs/en/skills).
