# Run state

Store local artifacts in `.engineering-team/runs/<run-id>/` in the target repository. Exclude them from version control unless the user deliberately exports them. The coordinator alone writes aggregate `state.json`; workers own individual result files. Use the packaged checkpoint commands when available, otherwise atomic temporary-file replacement with a last-valid backup.

Required checkpoint information: schema version, run identity, objective and design reference, acceptance criteria, repository/base identity, active mode `use-proofwork`, selected skills/playbook, assignments and ownership, work/review status, evidence references, supplied limits, latest observed host goal status, next action, and any outstanding side effects.

Work states: preparing, executing, reviewing, verifying, awaiting-input, stopped-incomplete, complete. These describe work; they do not change native goal lifecycle.

Checkpoint before dispatch; after results, integration, reviews and checks; before yielding or interruption. On continuation read this contract, the root skill, selected skills, and the host adapters. Inspect the actual checkout, native goal, live workers/processes, and external actions. Saved IDs are not proof of liveness. Inspect an uncertain external action before retrying it.

Complete requires all necessary criteria supported on the integrated artifact, no material unresolved finding, no outstanding worker that can change it, and authorized delivery fulfilled. Limits leave a stopped-incomplete record. Only host lifecycle rules authorize native completion, pause, or blocked status.

## Resume from observations

1. Read the checkpoint, root skill and active host contract. Confirm the target checkout and native objective before making changes. A checkpoint copied to another repository can be inspected with status but cannot be mutated there; start a new run.
2. Inspect current content and actual workers/processes. Determine which accepted results remain applicable. A saved worker ID or task status cannot establish liveness.
3. Reconcile pending effects. If a previous push, write or request timed out, inspect the destination or use its documented idempotency contract before repeating it. Do not clear an uncertainty merely to pass the guard.
4. Restore the next useful action and revalidate affected evidence. Preserve supplied limits; do not invent a new budget or silently replace the objective.

For an interrupted export, the next action might be "inspect the output manifest and verify the last page before retrying." "Run export again" skips the distinction between a failed request and an effect whose acknowledgement was lost.

## Recovery is an explicit operation

The local tooling saves a prior valid checkpoint and uses a per-run lock. If current JSON is corrupt, inspect the backup and actual repository, then use `recover --repo PATH --run ID --owner SESSION`. Recovery preserves damaged bytes, validates backup identity/structure and retains outstanding effects. It adds a reconciliation gap and stops incomplete; inspect actions after the backup before clearing that gap. Never automatically restore a backup or initialize a replacement run. If a lock remains after a crash, establish that no live writer owns it before removing it. Restoring local state does not undo external effects, recover unsaved source edits or prove that older evidence is current.

Save an actionable `nextAction`: the specific check or integration step and its owner. Keep uncertain external effects in `outstandingEffects` until observed reconciliation. A checkpoint describes work state; it is not a scheduler and cannot supply a missing host capability.
