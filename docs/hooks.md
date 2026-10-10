# Optional lifecycle hooks

The first implementation covers SessionStart recovery, UserPromptSubmit routing hints and Stop completion checks.
Standard marketplace packages contain no lifecycle configuration. Run `npm run build:hooks` to generate separate
packages in `.engineering-team/hook-packages/codex` and `.engineering-team/hook-packages/claude-code`.
Review the scripts and each host's `hooks/hooks.json` before manually installing through its supported trust flow.
Node.js 22 or newer must be available to the hook process. No global settings are edited.

Codex lifecycle-hook plugins require manual desktop installation and trust review and are excluded from the public
directory under the [packaging guidance](https://developers.openai.com/plugins/build/plugins).
Claude uses direct process arguments; Codex uses plugin-root command substitution. Contracts follow the
[Codex hook reference](https://learn.chatgpt.com/docs/hooks) and
[Claude hook reference](https://code.claude.com/docs/en/hooks). Host-event verification is separate from fixture tests.

## Bind a run explicitly

Initialize a full run through the existing runtime. Use the actual host session ID exposed by the prompt hint or
host event and that run's coordinator owner. Never invent an ID or select a run by creation time.
Replace placeholders and quote paths containing spaces; `<plugin-root>` is the installed package.

```text
node <plugin-root>/scripts/hook-binding.mjs bind --repo <repo> --host codex --session <host-session> --run <run> --owner <owner>
node <plugin-root>/scripts/hook-binding.mjs unbind --repo <repo> --host codex --session <host-session> --run <run> --owner <owner>
node <plugin-root>/scripts/proofwork.mjs preflight --repo <repo> --run <run> --owner <owner> --revision <revision>
```

Use `claude-code` for that host. Bindings live under `.engineering-team/hooks/bindings/<host>/<session>.json`.
Binding validates checkpoint identity and authority, is idempotent for the same assignment, and rejects replacement.
Unbind deliberately before switching runs. Concurrent creation publishes a complete file; unbind/rebind operations
are not serialized. Local state must be trusted; path checks cannot defend against a malicious same-user process
replacing directories during an operation.

## Event behavior

| Event | Scope and behavior |
| --- | --- |
| SessionStart | Recover the bound objective, phase, skills, next action, criteria, findings and effects. Quoted checkpoint values remain untrusted data. Stopped and awaiting states never authorize restarting work. |
| UserPromptSubmit | Recommend a route for an explicit root request or a bound active run. Preserve accepted context and permission limits. Hints do not change checkpoints or create goals. Stop/cancel/pause requests receive no hint. |
| Stop | For a bound active run and a recognized completion prefix, run read-only preflight. Request correction or an honest incomplete report if readiness fails. The recursion guard disables a second continuation. |

Unbound ordinary sessions and completed bindings receive no recovery or completion intervention. Explicit root
requests can still receive routing hints. Events read no transcripts, execute no project commands and write no state.
Malformed or oversized input and unavailable bindings return a generic advisory and allow the host to continue.

Preflight shares `complete` checks for current code identity, reviewed tasks, latest passing observations, artifact
digests, material findings and outstanding effects. It returns `{ready, reasons}` with exit zero even when readiness
is false; inspect the JSON. It creates no locks, backups or directories. `--allow-claimed` accepts weaker manual evidence
explicitly; the Stop hook never sets it. Readiness is a point-in-time observation, not an attestation against later
edits, dishonest criteria or a hostile local process.

Detection deliberately recognizes prefixes such as `Task complete.`, `Proofwork complete.`, `Done.` and `Finished:`.
It skips reports marked incomplete, blocked, unverified or awaiting input and requires `stop_hook_active: false`.
This conservative guard cannot understand every completion claim, prevent the user ending a session or complete
its native goal.

## Reset and remaining scope

Disable or uninstall the optional plugin through the host, then remove bindings if no longer needed. Keep evidence
until recovery is unnecessary. Clearing `.engineering-team/` removes bindings and evidence. Never commit it or
export raw logs containing credentials.

Changed-code checks, worker handoff hooks, other lifecycle events and native Git hooks remain outside this tranche.
There is no universal file/function size limit; commit formatting still defaults to off.

