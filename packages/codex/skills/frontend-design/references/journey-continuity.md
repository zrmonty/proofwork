# Journey continuity

Load for interfaces with index/detail navigation, multi-step work, filters, dialogs or returning sessions. A beautiful first viewport is incomplete if people lose their place or work as they move through the product. Use only the journeys the application actually supports.

## Establish what should survive

Trace arrival, discovery, detail/action and return. Identify durable work, temporary presentation state and derived values separately. A filter may belong in an existing URL contract; an unsaved form may belong to a bounded editor session; result totals should derive from the canonical response. Do not store every transient detail or invent cross-device persistence.

Express transitions as pure decisions over explicit state and events where practical. Navigation and storage remain owned effects. Define which inputs survive a transition and which become invalid when scope, identity or permissions change. Retaining state indiscriminately can show another account's work or apply a stale selection to a new result set.

## Worked case: publication index and essay

A reader filters a publication, opens an essay halfway down the list and returns. The index's visual craft should carry through the detail: typography, content measure, metadata and useful navigation remain coherent. A second promotional shell that competes with the essay weakens the journey even if it looks polished by itself.

If the incumbent navigation preserves filter and position, verify that behavior survives the redesign. If return currently resets the index, decide whether preserving context materially supports the task and falls within scope; do not promise it in copy until implemented. Direct links still need enough orientation for people who never saw the index.

Test the actual back/return path and a fresh detail arrival. A screenshot pair can show visual continuity but cannot establish history behavior, retained position or keyboard focus. Record these observations separately.

## Worked case: an editor changes context

A person edits one item, opens a second item and later returns. Decide whether the first draft is committed, retained, discarded or requires an existing confirmation mechanism. Show truthful state rather than automatically interpreting navigation as save. A pure transition can describe the requested context change and intended effect; the observed save outcome determines the rendered result.

If a request completes after context changes, check that its result cannot replace the second item's state. Identity belongs to the transition contract, not only to the visible heading. Preserve the current editor and recovery path on failure when the actual implementation supports it.

An account switch or permission change can invalidate retained inputs. Clear or isolate state according to the real ownership contract rather than keeping everything for convenience. Do not expose prior-account content while loading a new context.

## Design orientation without extra chrome

Use the smallest cues that answer “where am I, what am I working on, and how do I return?” A useful title, contextual link or selected navigation item can suffice. Breadcrumbs, sticky bars and footers earn space only when they answer a real question.

Keep orientation usable at narrow widths and with long names. Condensing labels must not remove the distinguishing identity. Rounded controls and softer surfaces can support an inviting direction; their shape cannot replace readable state, position or focus.

For dialogs and inserted content, use the established semantic/focus mechanism. Check entry, completion, cancellation and return in the running artifact. Avoid moving focus or scrolling simply to create motion; preserve the user's meaningful point of work.

## Evidence and stop condition

Choose a representative round trip plus the changed ownership/failure path when relevant. Capture the route, state, viewport and artifact identity; record actual interaction separately from visible composition. Recheck direct arrival and narrow navigation if the change affects them.

Stop when orientation and work preservation satisfy the brief without material regressions. If browser tooling is unavailable, deliver the bounded implementation or critique and keep continuity/focus claims unverified. Do not add a navigation framework or persistence layer just to satisfy this reference.
