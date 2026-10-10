# Interaction copy and review

Read this when copy participates in an action, system state, accessibility or localization. Wording is part of the interface contract.

## Match the observed state

| Situation | Useful copy shape | Verify before writing it |
| --- | --- | --- |
| Initial empty list | What belongs here and a real first action | The request succeeded and the list is actually empty |
| No filter matches | Explain the current filter and offer reset where supported | Existing items may be hidden; do not suggest creating duplicates |
| Failed load | Name the unavailable content and a safe recovery | Retry exists; absence of loaded items is not evidence of no data |
| Failed save | State the save outcome and whether work remains | Fields are retained, server result is known and repeat submission is safe |
| Uncertain payment | Explain uncertainty and the safe way to check | Do not imply failure or encourage a second charge without reconciliation |
| Successful operation | Confirm the result that matters | The server acknowledged the intended effect; queued work is not completed work |
| Destructive action | Name the object, scope and real reversibility | Undo, recovery, retention and affected permissions reflect implementation |

Examples are conditional on actual behavior:

```text
Empty: No events yet. Create an event to invite your group.
Filter: No events match these dates. Clear the date filter.
Load error: We couldn't load events. Try again.
Queued: Your export is queued. We'll show the download here when it's ready.
Confirmation: Delete these 3 drafts? This can't be undone.
```

The export line requires that the interface really updates that location. The deletion line requires that recovery is unavailable. Adapt the wording or identify the behavior question; do not implement missing behavior as incidental copy cleanup.

## Name actions without inventing promises

Use the verb and object appropriate to the consequence: Save draft, Send invitation, Download report. Keep short familiar labels when surrounding context supplies the object. A label such as Continue is reasonable in a multi-step flow when the next step is clear; it is vague when it immediately buys, publishes or deletes something.

Keep visible text, accessible names and confirmation wording consistent. An icon-only control still needs a useful accessible name. A shorter label is not better if a screen-reader user loses the affected object or if a touch user cannot distinguish adjacent actions.

Form help should answer a real question: required format, privacy of a field, or consequence of changing it. Do not add “Please enter your…” under every labeled input. Put important guidance where someone can use it before submitting. Keep errors connected to their field and preserve a usable general error for non-field failures.

## Preserve privacy and truth across surfaces

Inspect where the message can appear and who can read it. A user-facing error should not echo access tokens, private identifiers, raw queries or another person's details merely because the backend supplied them. Use the project's safe public error and support-reference mechanism where available. More conversational wording does not justify turning internal diagnostic detail into public copy. For access and account flows, preserve the established disclosure policy; do not make a generic response reveal whether a person or resource exists.

Compare messages for the same action across the button, confirmation, toast, detail view and notification. Identify the authoritative state and the audience of each surface. “Invitation sent” can be accurate after dispatch, while “Member joined” requires a different event. Do not let a shortened toast imply a stronger outcome than the detailed status. If source strings disagree with observed behavior, propose accurate copy or report the missing state contract; do not quietly alter the application to make the sentence true.

Preserve the useful cause without blaming the person. “Choose a date after today” describes a correctable input constraint. “You entered an invalid date again” adds accusation without helping. When the cause is unknown, say what is unavailable and offer the real next step rather than inventing a reassuring explanation. A human voice can admit uncertainty directly.

## Preserve string contracts

Inspect the existing localization mechanism before editing. Preserve IDs, named variables, plural categories, escaping, markup boundaries and formatter ownership. Keep whole translatable messages instead of concatenating fragments whose word order assumes English. Format dates, currency and numbers with the project's locale-aware mechanisms.

Test realistic long names and counts, including zero and one where grammar changes. Check pseudo-localization or existing locale previews when available. Do not assume the English sentence's length, order or informal tone carries across every locale. Report language review as missing when it was not performed.

Approved legal or regulated text has a meaning contract. Ordinary surrounding instructions can often be made clearer, but a material promise or consent clause needs its designated review. Produce a concrete proposed revision within scope; do not silently publish a new interpretation or use friendliness to bury consequences.

## Perform a bounded editorial check

1. Compare the existing and revised flow against the supplied facts and actual effects.
2. Confirm that every removed heading or paragraph had no unique required information; preserve usable structure and orientation.
3. Read ordinary and failure states together for stable terminology and excessive repetition.
4. Inspect the implemented copy at representative widths, including long labels and error text. Check affected accessible names and localization contracts with available tools.
5. Exercise changed action/state behavior where wording depends on it; preserve existing checks and avoid brittle tests for stylistic sentences alone.

For a text-only deliverable, identify assumptions and the missing render/interaction checks. For an implemented edit, report the actual checked surfaces and source identity. A natural sentence is not evidence of a functional flow, and a static screenshot is not proof of keyboard behavior.
