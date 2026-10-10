# Local Proofwork tools

Use Node.js 22 or newer. Resolve the package root from the loaded skill and run `node <package-root>/scripts/proofwork.mjs --help`. Commands use built-ins and return JSON; failures exit nonzero.

- `route --task TEXT [--files paths]` returns tier, playbook and selected skill names.
  Add `--explain` for reasons, selected principles and staged workflow guidance; `--tier light|standard|full` overrides subject to risk floors.
- `model-roles.mjs plan --repo PATH --host codex|claude-code --inventory PATH` resolves opted-in roles read-only.
  Inventories describe observed capabilities; plans never prove dispatch or enforce token budgets.
- `init`, `status`, `assign`, `result`, `finding` and `checkpoint` coordinate full-tier work.
- `init --host codex|claude-code --session ID` automatically binds a known host session; omit both for ordinary runs.
- `evidence --command TEXT` executes a check and records its actual exit, duration and stream digests. Manual evidence is marked claimed.
- `--timeout-ms` bounds executed evidence (default 120000; integer 1–3600000). Timeout records a failed observation.
- `complete` requires current accepted results and current evidence; `--allow-claimed` explicitly accepts the weaker manual form.
- `recover --repo PATH --run ID --owner SESSION` explicitly restores a corrupt/missing checkpoint from its validated backup under the writer lock. It preserves damaged bytes, retains the backup, stops incomplete and adds a reconciliation gap; valid runs must resume normally.
- `preflight` checks the same gates without writes; inspect `{ready, reasons}` rather than its exit status.
- Writes accept `--break-lock` only for inspected stale or remote locks; live local locks remain protected.

Read [tool interfaces](../contracts/tool-interface.md) when recording state, recovering a run or exporting coverage. It defines input schemas, identity checks and evidence limits. Add `.engineering-team/` to the target repository's ignore rules; initialization reports whether it is already ignored.

`check-coverage.mjs` evaluates an independently enumerated source inventory. `collect-coverage.mjs` normalizes real Node LCOV. In this repository, `verify-coverage.mjs` runs tests and enforces separate 95% line/branch gates. `check-file-lines.mjs` supports an explicit project ceiling and is disabled by default. `check-commits.mjs` reads the Git root's `.proofwork.json` commitFormat: proofwork, conventional or off (default). It returns {format, enabled, commits}, never rewrites history, and enforces no message policy without opt-in. `check-skill-list.mjs` rejects shared three-word trigger phrases; editorial review still decides semantic overlap. Context budgets cap entries at 600 words and references at 800 words.

For development, `npm run check` validates source width, routed context budgets, tests with actual coverage, packaging and the optional project file policy.

Optional lifecycle packages are built separately with `npm run build:hooks`. Associate an existing full run using
`hook-binding.mjs bind --repo PATH --host codex|claude-code --session ID --run ID --owner ID`;
`unbind` accepts the same selectors. No newest-run selection occurs. These commands do not enable hooks themselves.
Review host-specific `hooks/hooks.json` and install through the host's trust flow.

Context budgets count initial preparation/options and disclose deferred review/report entry words separately.
Option Arena defaults to two candidates; an explicit third stays within maxParallel and actual host capacity.

Named procedures: `route --explain` exposes `procedure`; read its packaged `path` before the selected phase guidance. The legacy `playbook` value remains a compatible checkpoint stage. See `playbooks/` and `shared/playbooks.json` in the package. Explicit full procedure names preserve a full floor; read-only intent still controls effects. Context-budget includes the selected guide, and the comparative harness injects the same guide.

Explained routing is the shared integration plan: plain route, optional prompt hints and comparative inputs use the same normalized intent. Prompt hints leave file discovery to the root rather than inheriting previous assignment paths. Required resume guidance counts in initial context; review/report entries remain deferred. See [the integrated flow](https://github.com/zrmonty/proofwork/blob/main/docs/flow.md).
