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

## Bind automatically when initializing

The coordinator passes `--host codex|claude-code --session <host-session>` to `proofwork.mjs init` using the actual
session ID supplied by the prompt hint or host event. Initialization writes the binding automatically; the user
does not run a separate binding command. Never invent an ID or select a run by creation time.
Replace placeholders and quote paths containing spaces; `<plugin-root>` is the installed package.

```text
node <plugin-root>/scripts/proofwork.mjs init --repo <repo> --run <run> --owner <owner> --objective "Task" --revision <revision> --criteria works --host codex --session <host-session>
node <plugin-root>/scripts/hook-binding.mjs unbind --repo <repo> --host codex --session <host-session> --run <run> --owner <owner>
node <plugin-root>/scripts/proofwork.mjs preflight --repo <repo> --run <run> --owner <owner> --revision <revision>
```

Use `claude-code` for that host. Bindings live under `.engineering-team/hooks/bindings/<host>/<session>.json`.
Binding validates checkpoint identity and authority, is idempotent for the same assignment, and rejects replacement.
Plain initialization without a host identity remains unbound. Supply both options together. An already bound session
is rejected before creating a new run. If binding publication fails after initialization, the error explicitly reports
that the run exists; inspect it and use `hook-binding.mjs bind` to recover rather than initializing another run.
Unbind deliberately before switching runs. Concurrent creation publishes a complete file; unbind/rebind operations
are not serialized. Local state must be trusted; path checks cannot defend against a malicious same-user process
replacing directories during an operation.
Repository roots and parent symlinks/junctions are allowed and canonicalized; links within `.engineering-team/`
remain rejected.

## Event behavior

| Event | Scope and behavior |
| --- | --- |
| SessionStart | Recover the bound objective, phase, skills, next action, criteria, findings and effects. Quoted checkpoint values remain untrusted data. Stopped and awaiting states never authorize restarting work. |
| UserPromptSubmit | Recommend a route for an explicit root request or a bound active run. Preserve accepted context and permission limits. Hints do not change checkpoints or create goals. Stop/cancel/pause requests receive no hint. |
| Stop | Run read-only preflight for a bound reviewing/verifying run regardless of wording, or a recognized completion claim in an earlier phase. Failing readiness requests correction. Awaiting/stopped phases and the recursion guard disable continuation. |

Unbound ordinary sessions and completed bindings receive no recovery or completion intervention. Explicit root
requests can still receive routing hints. Events read no transcripts, execute no project commands and write no state.
Malformed or oversized input and unavailable bindings return a generic advisory and allow the host to continue.

Preflight shares `complete` checks for current code identity, reviewed tasks, latest passing observations, artifact
digests, material findings and outstanding effects. It returns `{ready, reasons}` with exit zero even when readiness
is false; inspect the JSON. It creates no locks, backups or directories. `--allow-claimed` accepts weaker manual evidence
explicitly; the Stop hook never sets it. Readiness is a point-in-time observation, not an attestation against later
edits, dishonest criteria or a hostile local process.

Claim matching supplements state checks and recognizes evaluated natural phrases. In reviewing/verifying, even an
incomplete report triggers preflight: checkpoint `awaiting-input` or `stopped-incomplete` before stopping honestly.
The hook never changes state itself. `stop_hook_active: true` allows the continuation to end without looping.
Missing or invalid fields produce a visible advisory for a bound active run. Without a valid recursion flag, the hook
allows Stop rather than risking a loop. Missing/null message text still permits state-based checking when the flag is
false. Hosts document message text as nullable, so that advisory can also indicate an unavailable message.
Hooks cannot prevent a user interruption or complete a native goal. Claude API errors use StopFailure, not Stop.

The policy imports the runtime/router only after finding an active binding or explicit root request. Node still starts
for every configured event; hook-free packages avoid that cost. Native Claude SessionStart and UserPromptSubmit
dispatch are observed in [turn evidence](../evals/results/native-claude-turn-20261010.json). Authentication failed
before a model response, so native Stop blocking remains unverified; Codex native dispatch is also unverified.

## Reset and remaining scope

Disable or uninstall the optional plugin through the host, then remove bindings if no longer needed. Keep evidence
until recovery is unnecessary. Clearing `.engineering-team/` removes bindings and evidence. Never commit it or
export raw logs containing credentials.

Changed-code checks, worker handoff hooks, other lifecycle events and native Git hooks remain outside this tranche.
There is no universal file/function size limit; commit formatting still defaults to off.

