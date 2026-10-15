# Motion and feedback

Use when transitions, animation or changing feedback meaningfully affect the task. Start with an explicit
question: what relationship, state change or consequence should the person understand? If movement adds no
answer, prefer a stable result. Quiet interfaces can still have precise, satisfying feedback.

## Define the interaction before animating it

Name the trigger, authoritative state, pending state, interruption and final outcome. A pressed control may
acknowledge input immediately; a save confirmation must wait for the actual save contract. A successful
request is different from an optimistic appearance. Preserve an existing undo, retry or cancellation model
rather than suggesting capabilities through animation alone.

Use movement to connect related positions, reveal owned content or clarify insertion/removal. Keep competing
motion limited so the primary change remains legible. Durations should fit the interaction and input rate;
choose deliberately and test rather than applying one global delay or copied easing to every transition.
Controls must remain responsive during repeated input, navigation and interrupted transitions.

## Preserve meaning without movement

Provide a reduced-motion path that retains status, hierarchy and completion feedback while avoiding
nonessential spatial movement. Do not make content discovery depend on scroll choreography or hover.
Essential reading and actions should remain available if animation is disabled, assets fail or initialization
is delayed. Avoid autoplay loops that compete with sustained reading or repetitive operational work.

Screen-reader status, focus and visible feedback must agree. A toast cannot replace an inline field error,
and moving focus solely to advertise success may interrupt the person's next action. Follow established
semantic control/dialog mechanisms and check actual entry and return focus.

## Make effects earn their cost

For substantial effects, identify the rendering cost and input/device constraints first. Prefer changes that
do not repeatedly disturb layout; expensive paint, oversized filters and long tasks still require profiling.
A compositor-friendly property is not proof that a complex scene is cheap. Pause background work when the
component is absent or the view is inactive where appropriate, and clean up listeners, timers and animations.

Reserve space for asynchronous media and messages when their dimensions are known. Reflow that moves the
next target can turn attractive feedback into an accidental action. Do not use animated progress to invent
knowledge of an operation whose duration is unknown.

## Inspect a real sequence

Exercise start, repeated input, interruption, completion/failure and reduced motion as applicable. Compare
the same sequence at a narrow viewport and with realistic content. Record what moved, what retained focus
and whether the outcome was truthful. Runtime responsiveness needs a measurement or trace; screenshots
establish only the captured appearance.

Consult [MDN's reduced-motion reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
for the preference mechanism and [web.dev's CLS explanation](https://web.dev/articles/cls) for unexpected layout
movement. Use performance-increase for a measured optimization, keeping benchmark claims separate from taste.
