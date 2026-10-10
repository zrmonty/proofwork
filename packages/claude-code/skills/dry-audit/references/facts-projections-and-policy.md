# Facts, projections and policy

Load when repeated mappings, labels, totals, status tables or serializers appear to share a rule. Identify whether the duplication belongs to a canonical fact, a domain decision or a consumer-specific projection before extracting a helper.

## Name what is authoritative

A fact can have several legitimate representations. An invoice's stored amount, formatted label and exported amount may need different units or precision contracts. A status has a wire value, an internal meaning and a localized label. Sharing the fact does not require sharing every representation.

Trace inputs and change reasons. If two consumers independently decide what a status means, that policy may need one pure owner. If one displays a label and another emits a versioned wire value, merging their outputs can erase a supported distinction. Do not use one table merely because today's strings match.

Prefer derivation from existing canonical state over additional mutable totals, counts or flags. When a materialized value is required, inspect its update owner and consistency contract before deleting it. Caches and historical snapshots can have a legitimate different lifetime from live projections.

## Worked case: order totals in three places

An order summary, checkout and export calculate totals. Establish whether they mean estimated, authorized or settled amounts, which rounding policy applies, and whether taxes/shipping are included. Only the genuinely shared rule should move to one domain owner.

If all three are intended to show the same settled amount, inconsistent input filtering is policy drift. Add a distinguishing regression and migrate the actual callers to the pure calculation or canonical recorded result, as the domain requires. Do not recompute a historical settled amount with today's policy.

If checkout estimates differ intentionally from settlement, keep the distinct policy explicit. Extracting a universal total helper with several booleans can hide the distinction and couple future changes. Similar arithmetic is not sufficient evidence of common ownership.

Preserve units, ordering, error selection and precision. A shorter expression that changes rounding is a behavior change. Consumer tests remain useful for wiring, formatting and authorization even after shared domain cases are consolidated.

## Worked case: status maps drift

The UI, export and retry worker each contain a status table. Determine whether they duplicate the same allowed transition or merely adapt statuses for their own surfaces. A shared pure transition can own retry eligibility; the worker still enforces it against current committed state at the effect boundary.

Do not let localized labels drive domain decisions or turn every display value into a public wire contract. Map typed domain meaning to the existing presentation/wire mechanisms. Preserve unknown-value handling according to the actual boundary rather than defaulting every unrecognized status to success.

For cross-language consumers, one source of contract truth may still require distinct implementations. Use existing shared fixtures or generation when warranted; adding a toolchain to remove two small maps can increase maintenance. Generated copies are repaired through their source and regenerated.

## Verify knowledge, not just fewer lines

Use a meaningful policy change as a probe: after consolidation, which authoritative location changes, and which adapters remain intentionally different? If callers still contain the old rule, the extraction is incomplete. If unrelated policy now needs flags, reconsider the shared boundary.

Check a discriminating domain case and actual affected consumer paths. Expected values must be independent of the production calculation. Preserve distinct denied-action and error checks; duplicated-looking tests can protect different boundaries.

Report the authoritative fact/rule, consumer projections, removed copies and retained differences. Keep separate coverage and strict typing gates. Do not claim measured speed or maintenance savings from deleted lines, or change externally visible policy merely to achieve DRY.
