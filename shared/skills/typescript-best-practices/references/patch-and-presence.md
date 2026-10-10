# Updates, absence, and derived state

Read this when changing partial updates, form submission, optional fields, or derived UI values. A structurally compatible object can still request the wrong operation.

## Work backward from the update contract

An account form edits a display name and an optional nickname. The transport distinguishes an omitted nickname (“keep it”), null (“clear it”), and a string (“replace it”). A helper that spreads all form fields into a request can accidentally erase that distinction.

Write the operation meanings before choosing `Partial<Account>`. That utility describes optional properties; it does not establish which fields users may edit or what absence means. Reuse the existing request schema, or define a small explicit update shape when it prevents an actual mistake.

| Input condition | Decision to establish | Failure to expose |
| --- | --- | --- |
| Property absent | Leave unchanged or use documented default | Form initialization sends an unintended overwrite |
| Property present with null | Clear, reject, or store null | Truthiness check silently ignores a requested clear |
| Property present with undefined | Internal absence, invalid request, or explicit local policy | Presence checks and serialization disagree |
| Empty string or zero | Valid value, normalization, or rejection | `value || oldValue` restores the old value |
| Extra editable-looking field | Accept or reject under actual API policy | Whole domain record becomes a writable request |

These choices are protocol-specific. Do not introduce null or a new deletion sentinel into a compatible endpoint by preference.

## Calculate a proposed update

Decode the request into validated intentions, then apply a pure transformation to the supplied current value. Return the proposed value or a meaningful error. Preserve the previous value and intentional immutable sharing. Keep database writes, framework setters, audit emission and current authorization outside this calculation.

For a nested address change, decide whether it replaces the address or patches its fields. A shallow spread is not a deep-patch policy. An array update similarly needs an explicit replace/append/remove-by-ID meaning; position alone is unsafe when another user can reorder it.

Do not copy hidden permissions, derived totals or immutable identifiers into a user-writable patch. Validate the actual allowed fields at the authoritative boundary; a browser type cannot enforce this policy against another client.

## Keep form state and canonical state distinct

An unsaved draft can diverge from a refreshed record. Track the draft's base revision when the application needs conflict detection, and apply the incumbent conflict policy. Silently replacing the draft with a background fetch loses user input; silently submitting the whole old record can overwrite newer server changes.

Derive dirty indicators and validation summaries from the draft and its base when practical. Avoid storing additional mutable booleans that each handler must synchronize. Preserve a separate value only when it represents genuinely different information, such as the user's interaction history.

For optional-property diagnostics, inspect the effective compiler configuration. [Exact optional property checking](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html) can distinguish omitted properties from explicit undefined assignments. It does not settle transport semantics or justify an incidental global configuration migration.

## Verify through the real serializer and consumer

Exercise keep, clear, replace, valid empty/zero and rejected field cases only where the contract supports them. Check the exact emitted request and the server's resulting value, not just an internal object comparison. Include input preservation and a nested update when that path changes.

For a draft based on stale data, show the selected conflict behavior and retained user input. Static compatibility and unit patch tests do not prove server-side enforcement, concurrency safety or browser interaction; identify those gaps explicitly.
