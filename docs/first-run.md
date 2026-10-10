# First run

Use the native host install command at the top of the README. For a reviewed source checkout, the installer handles registration, installation and enabled/version verification in one invocation:

```text
node scripts/install.mjs --host codex
node scripts/install.mjs --host claude-code
```

Choose the host you actually use. It defaults to the Git marketplace; `--source .` uses the current built checkout. Source installs need `npm run build` first. The helper uses the native executable through argument arrays, with no shell interpolation. It stops after a failed step and does not claim success from an install exit alone. A pre-existing disabled policy remains visible; the helper does not override it.

Node 22+ and the selected native CLI must be available. A shell-only `.cmd` shim may need the host's supported native installation; the helper does not fall back to executing arbitrary shell text. Network, organization policy or CLI failures are reported by stage. Repair that prerequisite and retry. Registration/install are host-managed; interrupted installation may leave a registered marketplace. The helper does not change models, project policy, credentials or lifecycle hooks.

Claude's direct `--marketplace <source>` install needs 2.1.292+. For older supported versions, use registration then the qualified plugin name:

```text
claude plugin marketplace add zrmonty/proofwork
claude plugin install proofwork@proofwork-local
```

This follows the [official Claude command reference](https://code.claude.com/docs/en/plugins/cli-reference). Validate actual CLI support; the local helper's Claude execution remains unverified when that host is unavailable.

Start a fresh session. Describe your outcome through `$use-proofwork` in Codex or `/proofwork:use-proofwork` in Claude. No setup skill, tier name or model-role configuration is required. For example: “The invoice export sometimes loses the last page. Fix it while preserving the format and show that every page survives.”

The agent should inspect the relevant mechanism, reproduce the failure, make a proportionate repair and return the observed before/after, actual check and remaining operating limits. It should not ask you to select a playbook or model. Missing consequential facts or authority remain legitimate questions; a smooth first run does not justify guessing them.

Inspect routing or configure roles only when useful. See the README's uninstall/reset instructions for host removal and local run-state cleanup. Hook trust and live deployment remain separate actions.

## Recognize the first useful outcome

Choose a bounded real task in your project. A small fix needs no setup or ledger. Expect the changed behavior, an actual check on the delivered output, and an explicit operating boundary. For the invoice example: the last page was missing before the repair; the exported file now contains all input pages; the report links the check. A passing build alone is insufficient. Ask to inspect the evidence when the report omits it.

If execution is unavailable, the useful result is the inspected change plus the exact unchecked behavior and next action. It must not say verified. Hosting, credential rotation, deployment and live operation remain with the authorized operator unless explicitly included and observed.

## Resume without restarting

Continue in the same conversation: “Resume the invoice export repair; verify the delivered pages.” Preserve accepted criteria and existing edits. The agent inspects the current diff, recovers the next action and reruns only affected checks. Interrupted checks do not become passes. Light tasks use conversation/diff recovery; full tasks use their explicitly bound checkpoint. Never select the newest unrelated run.

For a damaged full-run checkpoint, inspect the backup and run the packaged `recover` command with the existing repository, run and coordinator owner. It retains damaged bytes and the backup and returns stopped-incomplete with a reconciliation gap. Inspect current files and uncertain effects since the backup, then checkpoint the real next action and revalidate affected evidence. Missing or invalid backups remain a visible gap; do not overwrite them or discard source work.

Full-tier and Harden-and-Finish reports link a [systems outcome](../shared/contracts/systems-outcome.md). It is the reusable operational handoff; unavailable checks and unassigned owners remain visible.
