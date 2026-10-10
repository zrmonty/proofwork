# Strict typing at integration seams

Read this when an SDK, plugin, callback, decorator or test double makes a strict Python boundary difficult to type. Fix the contract rather than allowing unknown behavior to spread into domain code.

## Start from the operation the caller needs

A partner SDK returns an untyped response. The application needs only an account identifier and a balance. Annotating that response as the domain record does not establish either field's runtime validity, and propagating `Any` lets mistakes bypass the strict checker.

Locate the effectful SDK call in one existing adapter. Treat its payload as `object`, validate the required shape and numeric policy, and return a small typed domain value. Preserve the SDK's meaningful failure and unknown-outcome distinctions. Do not introduce a universal SDK wrapper or duplicate all vendor types.

When maintained compatible stubs exist, use the project's dependency conventions. When a consumer needs a few stable operations, a minimal `Protocol` can express those operations without inheriting a large vendor class. A protocol describes static compatibility; it is not a payload validator.

## Make substitutions honest

| Seam | Required contract | Misleading shortcut |
| --- | --- | --- |
| Read-only consumer | Accept only operations it needs | Require a mutable collection just to simplify the helper |
| Fake client | Same meaningful return/error behavior as real boundary | Fake always succeeds and returns a convenient domain value |
| Callback | Precise argument, result and async policy | Bare callable annotation or ignored awaited result |
| Decorator | Preserve the callable relationship it actually promises | Erase parameters/results into unchecked `Any` |
| Mutable protocol field | Respect reads and writes that clients may perform | Widen its type as though only reads were possible |

Read the [Python protocol specification](https://typing.python.org/en/latest/spec/protocol.html) when structural compatibility or mutable attributes are unclear. Runtime protocol checks do not validate complete method signatures or domain semantics; do not use them as a trust boundary.

Use a read-only property where observation is the genuine contract and it allows a narrower implementation. Do not change an existing writable public API to read-only merely to obtain a type-check pass.

## Keep domain updates pure

The adapter owns the external call and decoded observation. A pure function consumes that observation with current state and explicit policy, then returns the proposed next state and effect requests. Avoid passing a live vendor response object into rules if another owner can mutate or lazily populate it.

For an asynchronous client, annotate and check the awaited result contract separately from the coroutine object. A fake synchronous method returning a record cannot establish a real async client's behavior. Retain cancellation, client lifetime and partial-effect ownership at the actual boundary.

## Make the strict gate cover the seam

Run the existing strict checker over the adapter, domain consumer, affected callers, callbacks and Python tests. Check the effective imports and included files so an untyped vendor import or excluded test module cannot hide the gap. Keep necessary narrowly documented third-party exceptions visible; do not suppress diagnostics in code that can be correctly typed.

Add a runtime check that challenges the actual boundary: malformed partner data, a legitimate result, a relevant vendor failure or changed callback signature. Prefer existing fixtures over live calls with credentials. Keep typed test helpers; replacing a difficult mock with an unconstrained object only moves the defect.

Report strict-check configuration and result independently of runtime checks. A correctly typed fake establishes static substitutability under that checker, not network compatibility, provider reliability or the safety of every SDK release.
