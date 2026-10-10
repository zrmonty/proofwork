# Run state

Store local artifacts in `.engineering-team/runs/<run-id>/` in the target repository. Exclude them from version control unless the user deliberately exports them. The coordinator alone writes aggregate `state.json`; workers own individual result files. Use the packaged checkpoint commands when available, otherwise atomic temporary-file replacement with a last-valid backup.

Required checkpoint information: schema version, run identity, objective and design reference, acceptance criteria, repository/base identity, active mode `use-proofwork`, selected skills/playbook, assignments and ownership, work/review status, evidence references, supplied limits, latest observed host goal status, next action, and any outstanding side effects.

Work states: preparing, executing, reviewing, verifying, awaiting-input, stopped-incomplete, complete. These describe work; they do not change native goal lifecycle.

Checkpoint before dispatch; after results, integration, reviews and checks; before yielding or interruption. On continuation read this contract, the root skill, selected skills, and the host adapters. Inspect the actual checkout, native goal, live workers/processes, and external actions. Saved IDs are not proof of liveness. Inspect an uncertain external action before retrying it.

Complete requires all necessary criteria supported on the integrated artifact, no material unresolved finding, no outstanding worker that can change it, and authorized delivery fulfilled. Limits leave a stopped-incomplete record. Only host lifecycle rules authorize native completion, pause, or blocked status.
