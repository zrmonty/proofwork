# Local Proofwork tools

Use Node.js 22 or newer. Resolve the package root from the loaded skill and run `node <package-root>/scripts/proofwork.mjs --help`. Commands use built-ins and return JSON; failures exit nonzero.

- `route --task TEXT [--files paths]` returns tier, playbook and selected skill names.
- `init`, `status`, `assign`, `result`, `finding` and `checkpoint` coordinate full-tier work.
- `evidence --command TEXT` executes a check and records its actual exit, duration and stream digests. Manual evidence is marked claimed.
- `complete` requires current accepted results and current evidence; `--allow-claimed` explicitly accepts the weaker manual form.
- Writes accept `--break-lock` only for inspected stale or remote locks; live local locks remain protected.

Read [tool interfaces](../contracts/tool-interface.md) when recording state, recovering a run or exporting coverage. It defines input schemas, identity checks and evidence limits. Add `.engineering-team/` to the target repository's ignore rules; initialization reports whether it is already ignored.

`check-coverage.mjs` evaluates an independently enumerated source inventory. `collect-coverage.mjs` normalizes real Node LCOV. In this repository, `verify-coverage.mjs` runs tests and enforces separate 95% line/branch gates. `check-file-lines.mjs` supports an explicit project ceiling and is disabled by default. `check-commits.mjs` checks outgoing feature sections.

For development, `npm run check` validates source width, routed context budgets, tests with actual coverage, packaging and the optional project file policy.
