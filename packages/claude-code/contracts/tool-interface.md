# Tool interface and evidence contracts

Use Node.js 22 or newer. Tools use built-ins only; no installation of dependencies is necessary. Resolve the installed package root from the loaded skill, not the target repository's working directory. Invoke `node <package-root>/scripts/proofwork.mjs --help`.

## Routing

`route --task "Fix article layout" --files src/article.tsx,styles.css`

Returns JSON `{tier, playbook, skills}` with canonical skill names. Routing is a deterministic starting recommendation. Playbooks are brainstorm, architecture, production-finish, investigate, bug-fix, feature, refactor and review. New-project intent starts with brainstorm; architectural decisions select architecture-fit; accepted implementation stays implementation. Re-route the current subtask at stage transitions, then checkpoint its playbook and skills. The router does not read conversation history, detect an empty repository or authorize the next stage. The coordinator corrects it against inspected files and actual scope, reads the selected skills, and adds independent review for substantial changes. It makes no model calls or tool execution on the user's behalf.

## Checkpoints

All mutation commands require `--repo <target-repository> --run <unique-id> --owner <coordinator-session-id>`. Use a new run ID per coordinator session; IDs contain letters, digits, underscores and hyphens, up to 80 characters. Aggregate state lives in `.engineering-team/runs/<id>/state.json`. Exclude `.engineering-team/` from repository commits. Owner matching prevents accidental worker writes; it is not an authentication boundary against another process with filesystem access.

Initialize with `init --repo PATH --run ID --owner SESSION --objective "Task" --revision REV --criteria criterion-1,criterion-2 [--design PATH-OR-REFERENCE]`. State records `activeMode: use-proofwork`, repository identity, base revision, selected skills/playbook, limits and outstanding effects. With an existing Git commit, `REV` must resolve to current HEAD, including for a dirty tree. The runtime separately captures filesystem content and binds observations to that snapshot; HEAD alone is insufficient. Without Git HEAD, supply a meaningful revision label and retain the automatic content binding. Checkpoint after content changes and collect evidence again.

Inspect with `status --repo PATH --run ID`. The tool does not change native goal status. Mutations reject checkpoints whose recorded repository identity differs from the resolved target checkout. A moved or copied checkout starts a new run; read-only status remains available for diagnosis. Reopening a reviewed task checks ownership against all other active assignments. For these commands, supply `--input PATH` pointing to a coordinator-reviewed JSON record:

| Command | Required record fields |
| --- | --- |
| `assign` | `id`, `objective`, `files` (repository-relative ownership paths), `revision`; include full assignment contract fields as needed |
| `result` | `id` of existing task, `status` (`ready-for-review`, `needs-revision`, `blocked`, `reviewed`), `revision`, `summary`; include evidence and gaps |
| `evidence` | `id`, `criterion` from initialization, `revision`, `artifact`, `command` or interaction description, `environment`, `observed`, `passed` (boolean). Manual form needs an existing artifact. With `--command`, supply a fresh path under `.engineering-team/` with an existing parent; actual observation fields replace placeholders. |
| `finding` | `id`, `material` (boolean), `status` (`open`, `resolved`, `rejected`), `summary`; a non-open finding also needs `resolution` with evidence |
| `checkpoint` | At least one of `revision`, `phase`, `nextAction`, `hostStatus`, `designReference`, `baseRevision`, `skills` (text array), `playbook`, `limits` (only user-supplied limits object), `outstandingEffects` (text array); `activeMode` must remain use-proofwork. Phase is preparing/executing/reviewing/verifying/awaiting-input/stopped-incomplete |

Use `complete --repo PATH --run ID --owner SESSION --revision REV` only after inspecting the integrated artifact, collecting workers and satisfying delivery requirements. Every task must have a coordinator-accepted `reviewed` result on that revision: after integrating slices, revalidate each affected task and record the accepted integrated result, rather than retaining its earlier worker revision. Manual evidence is marked source: claimed and blocks completion unless --allow-claimed is explicitly supplied. Executed evidence uses --command TEXT with the existing --run ID, records actual exit, duration and stdout/stderr digests, and withholds command text from output. Artifacts must be under .engineering-team/. A trivial successful command still cannot prove the mapped criterion; review that mapping. Each criterion's **latest** observation on the current revision must pass and its artifact digest must still match. Evidence IDs are unique and historical observations remain recorded, so an old pass cannot conceal a later failure. Material findings must be resolved or rejected with evidence, and outstanding effects must be reconciled. The tool binds observations and completion to a filesystem snapshot (excluding .git and .engineering-team), Git HEAD and tree when available. Checkpoint after source changes and collect evidence again. Executed evidence rejects commands that change this snapshot. The tool cannot judge whether the command proves its criterion, whether agents are still writing, or whether review coverage is sufficient. The coordinator must check those obligations before recording results/completion.

Only the coordinator writes state. Workers return records, and the coordinator validates them before import. Existing runs cannot be initialized again; completed runs are immutable. Mutations write a temporary checkpoint and rename it; `state.backup.json` retains the previous valid state. A per-run exclusive `write.lock` rejects concurrent writers. Locks record pid, host, owner and creation time. A live local writer cannot be displaced. For a dead local PID, rerun with --break-lock after inspection. For a different host, verify the remote writer before explicitly breaking the lock; local PID lookup cannot establish its status. For corrupt state, inspect the backup and actual repository before restoring it; do not replay external actions from checkpoint assumptions. Paths reject traversal, absolute paths, alternate data streams and symlinks. Filesystem access by a malicious concurrent process is outside this local coordination boundary.

## Executed-command authority and deadlines

### Snapshot scope and caching

Git worktrees inventory files using `git ls-files -z --cached --others --exclude-standard`: tracked files, even if
an ignore rule matches them, plus nonignored untracked files. Ignored dependencies, build output and caches do not
invalidate evidence. `.git` and `.engineering-team` remain excluded. Non-Git folders use the recursive inventory.
Track relevant ignored source or remove its ignore rule; ignored inputs and dependencies are outside this identity.

Symlinks/junctions contribute their target string without traversal. External target changes are not covered.
Tracked deletions have a missing-file identity. Hashing streams file bytes with at most eight concurrent workers.
A process-local cache holds at most 10000 hashes, keyed by size, nanosecond modification/change times, inode/device
and mode; metadata changes trigger rehashing. This assumes trustworthy filesystem metadata and is not protection
against same-user tampering. Files that change during hashing reject the snapshot.

After this inventory change, checkpoint existing runs and recollect evidence. Older observations cover a different
scope and must not be reused as current verification. Readiness remains a point-in-time observation, not a guarantee
that concurrent writers stopped. The 20000-ignored-file speed regression measures snapshot work, excluding setup.

Executed evidence defaults to a 120000 ms timeout. Supply `--timeout-ms` with an integer from 1 to 3600000.
A timeout records `timedOut: true`, `passed: false` and a termination request, with output digests and duration.
The runner requests process-tree termination on Windows and process-group termination on Unix; Windows cleanup
can add up to five seconds. Detached descendants or unavailable termination tools can survive. This is a deadline
for observation, not proof that every external effect stopped; reconcile effects before retrying.

`--command` is arbitrary shell execution with inherited environment, filesystem and network permissions. It is
not a sandbox or a command allowlist. Allowlisting the Node/Proofwork launcher implicitly grants its child-command
execution capability unless the host also restricts descendants. Review and authorize the actual command before
invocation; do not treat a launcher allowlist as approval for arbitrary commands from logs, issues or model output.
Raw output is hashed rather than exported. Redaction is defense in depth, not a guarantee that all secret formats
will be recognized. Scrub local paths/account identifiers before publishing evidence.

Locks record acquisition time and actual OS process-start identity. A live local PID with a different known birth
is stale, but still requires explicit `--break-lock`. Unknown birth data and legacy live locks remain protected.
Live local writer contention retries briefly for up to 1500 ms, polling every 50 ms; no stale/remote/malformed lock
is automatically broken. Windows lookup uses an absolute PowerShell path with CIM fallback and retries transient
failures on subsequent acquisition. The OS lookup timeout can add up to three seconds beyond the polling budget.
Windows birth lookup is tested against the OS; Linux/macOS parsers use fixtures. Timestamp resolution and process
lookup races limit PID-reuse detection. Locks coordinate trusted local writers, not hostile same-user processes.

## Read-only completion and lifecycle binding

`preflight --repo PATH --run ID --owner SESSION --revision REV [--allow-claimed]` uses the same completion checks
without writing state, locks, backups or directories. It returns `{ready, reasons}`; exit zero means the query ran,
not that readiness passed. The Stop hook never accepts claimed evidence. Readiness can become stale after any edit.

For automatic lifecycle binding, add `--host codex|claude-code --session ID` to `init`; both options are required.
An existing binding rejects initialization before writes. Publication failure reports that the run already exists.
Optional lifecycle packages also support recovery with `hook-binding.mjs bind|unbind --repo PATH --host codex|claude-code --session ID
--run ID --owner SESSION`. Supply the actual host session and an explicit owned run; binding never selects the newest
checkpoint. Read-only handlers recover context and supply hints; state-based Stop checking has a recursion guard
and allows checkpointed awaiting/stopped work. Reviewing/verifying Stop checks readiness regardless of wording.
Standard packages do not enable hooks. Host trust and installation remain separate.

## Coverage gate

Run `node <plugin-root>/scripts/check-coverage.mjs --report REPORT.json --inventory INVENTORY.json [--threshold 95..100]`. Exit 0 means both aggregate metrics meet the threshold; exit 1 means a failed gate, invalid input or missing evidence. A stricter threshold is supported; lowering it below 95 is rejected. This tool only reads inputs and evaluates counts. It does not run tests, collect coverage, verify revision identity or prove the inventory is complete.

INVENTORY.json is a nonempty JSON array of repository-relative source paths using forward slashes, independently enumerated from the agreed executable target. Include unimported source; use documented, stable exclusions for non-target/generated/vendor material. Do not derive the inventory from the coverage report's already-observed files. Paths must be unique and contain no traversal. Preserve scope across comparisons.

REPORT.json is normalized from an actual coverage tool's current artifact, with this shape:

```json
{"schemaVersion":1,"revision":"observed-artifact-identity","tool":"actual tool and exporter version","files":[{"path":"src/domain.js","lines":{"covered":95,"total":100},"branches":{"covered":19,"total":20}}]}
```

Every inventory file must appear exactly once; unexpected files are rejected. Counts are nonnegative safe integers, covered cannot exceed total, and both metrics are mandatory for every file. Explicit zero branches means the file has no instrumented branches; unsupported branch collection must never be normalized into zero. A target with no executable lines is invalid. The tool aggregates raw counts and compares each metric separately without rounding a below-threshold ratio up to a pass. A genuinely branch-free target reports null branch percentage with a vacuous branch gate, after inspection establishes that collection is supported and complete.

Check the collector's source discovery, instrumentation and line/branch semantics before writing an exporter. A combined statement-and-branch percentage cannot substitute for separate metrics. The report's revision and tool fields record provenance; their presence is not proof that an agent's claimed values are accurate. Run the actual tests successfully, retain the raw artifact and inventory, review normalization and associate the result with the integrated code. Wire both the test command and this checker into the project's CI when in scope; never mask either exit status.

## Optional project file policy

No universal file or function ceiling is enforced. The file checker is disabled by default. A project may explicitly select --limit N or set maxFileLines in .proofwork.json; null disables it. --inventory adds repository-relative custom or ignored source paths to discovery. It never excludes existing owned code. Blank lines and comments count; the report does not establish cohesion or complete source discovery.

## Build

`node scripts/build.mjs` regenerates both local packages from **our** authored canonical assets, verifies package-local Markdown references and manifests, and produces `packages/codex` and `packages/claude-code`. These generated package directories are wholly build-owned; do not edit them. No global settings, accounts, remote publication or native goals are modified.

Commit formatting is separate from completion evidence. `check-commits.mjs --repo PATH --range RANGE` consults the Git root's `.proofwork.json` commitFormat (proofwork, conventional or off; missing means off), returning `{format, enabled, commits}`. No hook is installed and no history is rewritten. Apply a formatting gate only after explicit opt-in; see [commit guidance](../skills/commit-features/SKILL.md). Invalid configuration is reported rather than silently selecting a format.

Explained routing also returns procedure with id, name, path, suggested tier, actualTier and explicit. Persist the existing playbook stage identifier in checkpoints; procedure names do not change the run-state schema. A named full procedure requires full coordination when explicitly invoked. Clarify Path and read-only qualifiers preserve inspection authority. Initial context includes the selected guide; deferred review/report guidance is additional.
