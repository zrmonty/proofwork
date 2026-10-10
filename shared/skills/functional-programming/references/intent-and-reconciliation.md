# Intent, stale snapshots, and reconciliation

Read this when pure transitions drive optimistic UI changes, concurrent edits, partial effects or recovery. Separate what the user asked for from what an old snapshot happened to contain.

## Preserve the meaning of the event

Two users edit a cart with quantity two. One requests “add one”; the other requests “set quantity to five.” Treating both as replacement records calculated from quantity two makes a conflict look like an ordinary overwrite.

Name the actual intent and its base state where needed. An increment event and an absolute replacement have different conflict policies. Do not automatically rebase either: recomputing against the latest state is valid only when the domain says that intent remains applicable.

| Observation | Pure decision | Boundary responsibility |
| --- | --- | --- |
| Fresh eligible intent | Proposed next value and necessary effect request | Authorize and commit under the current version |
| Version conflict | Recompute eligible intent, ask for resolution, or reject | Read authoritative current state; execute no rejected effects |
| Partial result | Keep confirmed, refused and unknown outcomes distinct | Obtain trustworthy observations and own reconciliation |
| Obsolete result | Ignore or resolve according to operation identity | Preserve the current operation's ownership |
| Uncertain remote write | Represent uncertainty and lookup eligibility | Use actual lookup/idempotency contract before retry |

These choices belong to the product's semantics. A generic conflict resolver cannot infer user intent from a stale complete record.

## Keep optimistic presentation separate

An interface may show an intended change before confirmation. Represent that as a pending projection over canonical confirmed state, rather than silently claiming the server committed it. Derive the view from confirmed data plus current pending intentions where practical.

If an operation fails after newer work arrives, restoring one old whole-state snapshot can erase that newer work. Remove or reconcile the failed operation's own contribution under the actual dependency policy. Dependent pending operations may need recomputation or a visible conflict; do not invent inverse operations for irreversible effects.

For multi-item deletion, a response confirming three, refusing two and leaving three unknown should update each category independently. Unknown items remain eligible for reconciliation, not a success count or an automatic repeat. Keep IDs and operation identity in pure events, without executing deletion from the transition.

## Derive instead of synchronizing

Inventory canonical values, pending intentions and observations. Calculate totals, selected eligible items, labels and allowed actions from those values. Retain a separate mutable field only when it contains information not recoverable from the canonical inputs, such as a user's unsaved draft or an actual external acknowledgment.

Supply time, policy and observed version explicitly. A selector that reads an ambient cache or clock is no longer a predictable calculation over its listed inputs. An immutable outer record still needs an honest nested ownership contract.

## Test sequences that distinguish the policies

For the cart scenario, check the chosen outcome for increment versus replacement on conflict; do not assert whichever result the implementation produces. Verify original values remain unchanged and the same supplied event sequence produces the same proposed results.

For optimistic work, exercise an older failure arriving after newer intent, duplicate results and partial confirmation. Assert both the resulting view and which effect requests remain eligible. Use independent case reporting rather than one chain that hides later failures.

Separately verify the real owner rejects a stale commit and does not execute its effects. Pure replay can demonstrate decision consistency; it cannot establish authorization, transactionality, durable recovery or remote exactly-once delivery.
