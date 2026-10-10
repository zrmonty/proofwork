# Claude Code runtime

Start a local session with `claude --plugin-dir <absolute-path-to-packages/claude-code>`, then invoke `/proofwork:use-proofwork <task>`. Claude namespaces plugin skills; the package does not promise a bare `/use-proofwork` alias. The root skill loads setup, routing and relevant guidance automatically. No user-wide configuration or hooks are installed. Validate with `claude plugin validate <package-path>` when that CLI is available.

Discover live delegation tools, shell access and browser integrations. Use supported subagents for bounded independent assignments, with explicit ownership, acceptance criteria, selected bundled skills and result contracts. Do not invent native team features when only ordinary subagents are exposed. A worker reads its assigned skills independently. The coordinator alone records aggregate checkpoints and integrates results. Overlapping edits require isolated checkouts and sequential integration.

Keep the session model by default. Configured role models must be supported by the actual Claude host; report unavailable mappings before dispatch. Cross-provider workers need an external bridge and are outside this package. Use [goal lifecycle](goal.md), [CLI control](control-cli.md), [browser control](control-ui.md), and [checkpoint interface](../scripts/README.md).

Source: https://code.claude.com/docs/en/plugins-reference . Manifest is `.claude-plugin/plugin.json`, skills live in `skills/<name>/SKILL.md` and invocation is namespaced. Host behavior still requires real-session evaluation.
