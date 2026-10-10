# Recovery and evidence

Read on interruption, continuation, uncertain external actions or apparently contradictory verification. The checkpoint describes prior observations; inspect present reality before taking the next action. Use the packaged tool reference for command arguments and valid records.

## Resume decisions

1. Read the live native goal, root skill, adapter and checkpoint. Preserve the objective, design reference, authorization and user limits.
2. Verify the resolved repository and checkout. Checkpoint mutation is bound to recorded repository identity; a moved/copied checkout starts a new run after inspection, rather than mutating a copied checkpoint.
3. Inspect actual working changes and current content identity. Do not reset to the saved base or discard unexpected changes. Determine which are user work, collected worker work or incomplete effects.
4. Reconcile live workers/processes through available host tools. Saved IDs alone do not establish running status. Before reopening work, resolve current ownership; a formerly reviewed task may now overlap an active assignment.
5. Inspect external actions and evidence, then set one useful next action. If a required fact is unknown, collect it rather than replaying the whole workflow.

A write lock left after a crash is not automatically stale. Check for a live writer before manually removing it. If state is corrupt, inspect the backup and checkout before restoring it. Recovery must not silently erase work completed after the backup.

## Interrupted push

Suppose the push command returned uncertain status and the checkpoint still says “push pending.” Inspect the remote branch/ref and local commits through the available authenticated read path. If the remote contains the intended commit, record that observed result and continue authorized delivery. If it does not and authorization still covers pushing, retry the known operation. If remote state cannot be inspected, retain the outstanding effect and report the specific gap; do not infer failure or success.

A PR creation with an uncertain response requires checking for the intended existing PR before retrying. A deployment, notification or charge may have a different identity/retry contract: use that system's documented lookup or idempotency behavior. Do not generalize a safe Git retry into permission to repeat arbitrary external writes.

## Interrupted worker

A worker saved changes but its last message is missing. Inspect the checkout and host status. If still modifying, collect or use supported cancellation before reassignment; report cancellation that cannot be confirmed. If finished, inspect the artifact and recover its evidence where available. Missing logs are missing proof, not an invitation to reconstruct a passing output from memory.

If user changes overlap the worker's paths, pause those writes and reconcile ownership without overwriting either side. Independent unaffected tasks may continue. A continuation does not implicitly enlarge permissions or authorize a new model/provider.

## Evidence that supports the claim

A useful evidence record says, for example: “On snapshot S, Node version V ran the repository's export regression from checkout P; multi-page, single-page and empty cases passed, exit 0; bounded output is in artifact A.” It does not say “fully tested” if only export tests ran.

The content identity must describe what was observed. `HEAD` while relevant files are dirty is insufficient. Record a snapshot or content digest covering the behavior and its dependencies, and create a new identity after relevant changes. Artifact hashes protect the recorded file from later alteration; they do not prove the test ran or that the revision is truthful.

Keep observations monotonic as history, not as success selection. A newer failed observation on the same criterion/current identity defeats an older pass. Investigate why it failed and rerun after a supported fix; do not delete the failure or reuse an older success to complete. Distinguish a transient external outage from a behavior defect using observed service/environment evidence, without changing the user's required criterion.

## Finish or remain incomplete

Before the local completion guard, check facts it cannot infer: all modifying workers are collected, actual content matches the recorded identity, observations are honest, reviewed scope is adequate and authorized delivery is finished. The guard checks structure, latest criterion results and artifact digests. A successful guard is separate from native goal completion.

If a limit or interruption prevents finishing, save remaining criteria, attempts, concrete gap and next action. Use the host's actual lifecycle rules for pause/blocked/complete. A missing browser may leave visual proof incomplete while tests remain useful; it does not convert partial acceptance into completion. Do not start a background loop to bypass the host's continuation model.

## Reconcile changes in the task itself

A later user correction can change a requirement without cancelling the objective. Identify which decisions, implementation slices and checks depend on it; preserve unaffected useful work and revise dependent assignments. Do not finish against superseded acceptance or restart every investigation from scratch. Preserve authorization separately: a new design preference does not automatically authorize a new external effect.

On resume, a clean working tree may still be the wrong artifact if a dependency, environment or remote release changed. Compare the relevant manifest, configuration and deployment identity before reusing checks. Likewise, a dirty unrelated note need not invalidate a previously observed parser behavior. Explain selective reuse through actual dependencies rather than treating timestamps or cleanliness as proof.

Keep the next action specific enough for another coordinator to continue: reconcile the remote ref, observe the pending job's outcome, obtain the required fixture, or verify a named criterion on the current snapshot. “Continue testing” and a list of past intentions leave important decisions hidden. If there is no confirmed success, retain uncertainty rather than reconstructing it from the planned command.
