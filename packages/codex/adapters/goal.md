# Goal lifecycle

## Native ownership

The native host owns continuation and goal state; Proofwork never installs a scheduler or creates a second loop. Read the live goal tools' descriptions first. Attach to an existing goal without replacing its objective. Create a goal only for an explicit user goal request, and only when no active goal prevents creation. Set a token budget only when the user explicitly requests one. If native goal tools are unavailable, report that limitation and offer manual resume from the checkpoint; plugin instructions cannot supply native continuation.

## Continuation and recovery

On continuation, read native goal state, the root skill and checkpoint; inspect the repository and reconcile live workers before continuing. Old agent IDs do not prove that work is running. Revalidate evidence against the current integrated revision. Checkpoint before dispatch, after integration/review, and before yielding or host limits stop execution.

## Completion and limits

Complete the native goal only after Proofwork's criteria, current evidence, independent review, worker collection and authorized delivery requirements are satisfied. Pause only on the user's explicit request, then report status and stop. Where the live contract requires three consecutive goal turns with the same blocker and no meaningful path remaining before blocked status, observe that rule, including resetting the audit after a user resumes a blocked goal. Follow updated host rules if they differ. Limits and interruption leave stopped-incomplete checkpoints; they never establish success. Cancel through supported tools, preserving work and reporting cancellation that cannot be confirmed.

## Host contract

Source: https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex . Tool descriptions available at execution take precedence over this reference.
