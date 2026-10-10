# Local Proofwork tools

Use Node.js 22 or newer. Tools use built-ins only; no installation of dependencies is necessary. Resolve the installed package root from the loaded skill, not the target repository's working directory. Invoke `node <package-root>/scripts/proofwork.mjs --help`.

## Routing

`route --task "Fix article layout" --files src/article.tsx,styles.css`

Returns JSON `{playbook, skills}` with canonical skill names. Routing is a deterministic starting recommendation. Playbooks are brainstorm, architecture, production-finish, investigate, bug-fix, feature, refactor and review. New-project intent starts with brainstorm; architectural decisions select architecture-fit; accepted implementation stays implementation. Re-route the current subtask at stage transitions, then checkpoint its playbook and skills. The router does not read conversation history, detect an empty repository or authorize the next stage. The coordinator corrects it against inspected files and actual scope, reads the selected skills, and adds independent review for substantial changes. It makes no model calls or tool execution on the user's behalf.

## Checkpoints

All mutation commands require `--repo <target-repository> --run <unique-id> --owner <coordinator-session-id>`. Use a new run ID per coordinator session; IDs contain letters, digits, underscores and hyphens, up to 80 characters. Aggregate state lives in `.engineering-team/runs/<id>/state.json`. Exclude `.engineering-team/` from repository commits. Owner matching prevents accidental worker writes; it is not an authentication boundary against another process with filesystem access.

Initialize with `init --repo PATH --run ID --owner SESSION --objective "Task" --revision REV --criteria criterion-1,criterion-2 [--design PATH-OR-REFERENCE]`. State records `activeMode: use-proofwork`, resolved repository identity, base revision, selected skills/playbook, supplied limits and outstanding effects. `REV` identifies the integrated content being verified: a Git commit for a clean tree, or a recorded content digest/snapshot including uncommitted changes. A Git HEAD alone does not identify a dirty tree. Never reuse an identity after changing relevant content.

Inspect with `status --repo PATH --run ID`. The tool does not change native goal status. Mutations reject checkpoints whose recorded repository identity differs from the resolved target checkout. A moved or copied checkout starts a new run; read-only status remains available for diagnosis. Reopening a reviewed task checks ownership against all other active assignments. For these commands, supply `--input PATH` pointing to a coordinator-reviewed JSON record:

| Command | Required record fields |
| --- | --- |
| `assign` | `id`, `objective`, `files` (repository-relative ownership paths), `revision`; include full assignment contract fields as needed |
| `result` | `id` of existing task, `status` (`ready-for-review`, `needs-revision`, `blocked`, `reviewed`), `revision`, `summary`; include evidence and gaps |
| `evidence` | `id`, `criterion` from initialization, `revision`, `artifact` (repository-relative existing file), `command` or interaction description, `environment`, `observed`, `passed` (boolean) |
| `finding` | `id`, `material` (boolean), `status` (`open`, `resolved`, `rejected`), `summary`; a non-open finding also needs `resolution` with evidence |
| `checkpoint` | At least one of `revision`, `phase`, `nextAction`, `hostStatus`, `designReference`, `baseRevision`, `skills` (text array), `playbook`, `limits` (only user-supplied limits object), `outstandingEffects` (text array); `activeMode` must remain use-proofwork. Phase is preparing/executing/reviewing/verifying/awaiting-input/stopped-incomplete |

Use `complete --repo PATH --run ID --owner SESSION --revision REV` only after inspecting the integrated artifact, collecting workers and satisfying delivery requirements. Every task must have a coordinator-accepted `reviewed` result on that revision: after integrating slices, revalidate each affected task and record the accepted integrated result, rather than retaining its earlier worker revision. Each criterion's **latest** observation on the current revision must pass and its artifact digest must still match. Evidence IDs are unique and historical observations remain recorded, so an old pass cannot conceal a later failure. Material findings must be resolved or rejected with evidence, and outstanding effects must be reconciled. The tool enforces these structural gates; it cannot judge whether observations are honest, whether a revision represents current content, whether agents are still writing, or whether review coverage is sufficient. The coordinator must check those obligations before recording results/completion.

Only the coordinator writes state. Workers return records, and the coordinator validates them before import. Existing runs cannot be initialized again; completed runs are immutable. Mutations write a temporary checkpoint and rename it; `state.backup.json` retains the previous valid state. A per-run exclusive `write.lock` rejects concurrent writers. After a crash, inspect live writers before manually removing a stale lock. For corrupt state, inspect the backup and actual repository before restoring it; do not replay external actions from checkpoint assumptions. Paths reject traversal, absolute paths, alternate data streams and symlinks. Filesystem access by a malicious concurrent process is outside this local coordination boundary.

## Coverage gate

Run `node <plugin-root>/scripts/check-coverage.mjs --report REPORT.json --inventory INVENTORY.json [--threshold 95..100]`. Exit 0 means both aggregate metrics meet the threshold; exit 1 means a failed gate, invalid input or missing evidence. A stricter threshold is supported; lowering it below 95 is rejected. This tool only reads inputs and evaluates counts. It does not run tests, collect coverage, verify revision identity or prove the inventory is complete.

INVENTORY.json is a nonempty JSON array of repository-relative source paths using forward slashes, independently enumerated from the agreed executable target. Include unimported source; use documented, stable exclusions for non-target/generated/vendor material. Do not derive the inventory from the coverage report's already-observed files. Paths must be unique and contain no traversal. Preserve scope across comparisons.

REPORT.json is normalized from an actual coverage tool's current artifact, with this shape:

```json
{"schemaVersion":1,"revision":"observed-artifact-identity","tool":"actual tool and exporter version","files":[{"path":"src/domain.js","lines":{"covered":95,"total":100},"branches":{"covered":19,"total":20}}]}
```

Every inventory file must appear exactly once; unexpected files are rejected. Counts are nonnegative safe integers, covered cannot exceed total, and both metrics are mandatory for every file. Explicit zero branches means the file has no instrumented branches; unsupported branch collection must never be normalized into zero. A target with no executable lines is invalid. The tool aggregates raw counts and compares each metric separately without rounding a below-threshold ratio up to a pass. A genuinely branch-free target reports null branch percentage with a vacuous branch gate, after inspection establishes that collection is supported and complete.

Check the collector's source discovery, instrumentation and line/branch semantics before writing an exporter. A combined statement-and-branch percentage cannot substitute for separate metrics. The report's revision and tool fields record provenance; their presence is not proof that an agent's claimed values are accurate. Run the actual tests successfully, retain the raw artifact and inventory, review normalization and associate the result with the integrated code. Wire both the test command and this checker into the project's CI when in scope; never mask either exit status.

## Code-file length gate

Run `node <plugin-root>/scripts/check-file-lines.mjs --repo PATH [--inventory additional-code-paths.json]`. The limit is fixed at 500 physical lines; it cannot be raised through an option. Exit 0 means discovered files pass; exit 1 means a violation or incomplete/invalid inspection. Blank lines and comments count. A terminating newline does not add a phantom line. CRLF, LF and CR are recognized, along with UTF-8 and BOM-marked UTF-16 text.

Git discovers tracked and non-ignored untracked code by supported source extensions and common build-script names. Discovery includes tests and generated files when present in that set. The optional inventory is a JSON array of repository-relative forward-slash file paths and is **additive**, never a replacement or exclusion list. Supply custom-language, extensionless, notebook or ignored application-code artifacts there after inspecting the project. Prose, data and external dependency artifacts are not source; do not misclassify live code to bypass the rule. Empty discovery, unreadable input, escaping paths and symlink file inputs fail inspection.

The checker reads the current worktree without modifying it. Its JSON report includes inspected files, counts and violations; it does not prove complete discovery, snapshot stability or cohesive architecture. Run on the final integrated artifact and retain its identity with the report. Minification, multi-statement compression, removal of meaningful comments and inventory manipulation do not satisfy the engineering rule. Fix generators or split modules by responsibilities, preserving behavior and consumers. Report existing or out-of-scope violations for coordination; no grandfathering or structural exception raises the limit.

## Build

`node scripts/build.mjs` regenerates both local packages from **our** authored canonical assets, verifies package-local Markdown references and manifests, and produces `packages/codex` and `packages/claude-code`. These generated package directories are wholly build-owned; do not edit them. No global settings, accounts, remote publication or native goals are modified.
