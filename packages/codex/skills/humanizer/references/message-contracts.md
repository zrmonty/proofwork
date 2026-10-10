# Messages as contracts

Load when wording is reused across surfaces, contains dynamic values, requires translation, or summarizes multiple outcomes. Improve the source meaning and composition without changing the event it describes. This reference does not prescribe a translation library or universal voice.

## One event, several useful expressions

Separate the domain fact from the sentence. An invitation can be created, submitted for delivery, delivered, accepted or expired; these are different observations. A control names an intended action, a toast describes its observed result, and a detail view describes current state. They need consistent meaning, not necessarily identical text.

Keep any message selection pure over explicit observed outcomes and relevant policy. The UI adapter owns announcing or rendering it. Do not send notifications from a formatter, mutate workflow state to match friendlier wording, or infer success from an action label.

Reuse an existing canonical event/status when available. A new parallel “copy status” can drift from the application's state. If the current contract cannot distinguish a material outcome, report the behavior gap rather than inventing certainty in the sentence.

## Worked case: a partial bulk action

Eight requested items produce three confirmed changes, two refusals and three unknown outcomes. A message can state the confirmed result and point to unresolved items; it cannot call the whole selection finished. The names shown must follow the established disclosure policy.

If “3 of 8 updated” could imply five definite failures, add concise context for the unknown results at the appropriate surface. A compact toast can direct people to a detail region that distinguishes categories. Do not stuff every diagnostic into one sentence or hide unresolved outcomes behind a success color.

Recovery wording follows the actual operation: “Check status” can be safer than “Try again” when repeating an uncertain effect risks duplicates. An undo label needs an implemented reversal contract. Natural wording cannot compensate for an unsupported action.

## Dynamic language is not string assembly

Inspect message keys, named variables, plural/select rules and formatting before editing. Keep count, identity, tense and action relationships meaningful in the complete message. Fragments such as “Saved ” + count + “ item(s)” can impose source-language grammar on other languages; use the project's existing full-message mechanism when this matters.

Preserve the semantic type of dynamic values. A formatted date should describe the same event/timezone as its label; an amount needs its established unit and precision; a display name is untrusted content, not markup. Use the current escaping/formatting boundary rather than converting safe text to raw HTML for emphasis.

Example: “Changes saved on {date}” and “Scheduled for {date}” may share a date placeholder but describe different facts. Sharing the entire message based on visual similarity erases that distinction. A translated version must preserve the event, not merely render the variables.

Do not invent translations or rewrite approved legal meaning merely to finish a visual pass. Leave unsupported locale behavior explicit and coordinate the required language/approval owner when material.

## Content length is a design input

Check zero, one, several and large counts where the flow supports them, plus a representative long supplied name. Use actual translated resources when available; stress text can reveal overflow but is not a certified translation. Preserve accessible names and visible context when truncating.

Avoid changing a precise message into an ambiguous shorter label solely to fit a component. Adjust wrapping, grouping or disclosure with the design owner. Keep the essential consequence and recovery readable on the narrow view.

## Acceptance evidence

Compare messages against the authoritative event and the visible flow. Verify changed interpolation branches and escaping with existing mechanisms; render affected states when implementing UI. Retain a distinct check for unknown/partial outcomes when present.

Record which states, counts and locales were actually checked. A source review can support semantic clarity but cannot establish translation quality, rendered accessibility or user satisfaction. No detector score or invented anecdote is evidence of human writing.
