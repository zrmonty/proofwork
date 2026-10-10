# Function size and complexity

Read when writing, splitting or auditing functions under the hard ten-line cap. Size is a measurable requirement; clarity and preserved behavior are separate requirements.

## Count the actual definition

Count physical source lines from the first attached attribute/decorator or signature line through the final body line. Include multiline parameters/types, opening/closing braces, comments and blanks inside that span. Expression-bodied arrows/lambdas include their whole expression. A nested function or callback has its own limit and still occupies lines in its enclosing function. Exactly ten passes; eleven fails.

Use normal project formatting before measuring. Putting several statements on one line, hiding a multiline body in a macro/string or removing useful comments to pass fails the rule's purpose. Generated functions need their generator/template decomposed; excluding output does not raise the cap. Third-party sources are outside project ownership.

Use the existing language parser/linter if it can measure these boundaries, or a clearly scoped manual inspection. Verify its definition and inclusion rules against the actual limit. A brace regex cannot reliably parse every language, and the bundled file-lines checker measures whole files only. Record unsupported/custom language discovery and retained violations rather than presenting a partial scan as complete.

## Split by a decision someone can name

Trace inputs to output and identify the independent responsibilities: decode an untrusted value, calculate eligibility, propose a next state, commit an effect or translate an outcome. Keep pure domain decisions distinct from adapters, with explicit values crossing the boundary. Reuse the owner already present before introducing another helper.

Remove dead branches or duplicate policy before extraction. A long routine may become small by subtracting obsolete work. If extraction is still needed, the helper should answer a domain question or own a real resource operation; names such as step1, continueWork or handleRest conceal the original complexity.

Do not pass a mutable context bag through a series of fragments that secretly communicate by side effects. Return a typed decision/value and make its consumer visible. A private accumulator is valid when it makes a pure calculation direct. Ten short functions can still create an opaque flow if each merely forwards to the next.

## Preserve the difficult part

Extraction can change exception scope, callback timing, lock duration, await ownership, transaction lifetime and which validation happens first. Keep those contracts explicit. Do not split acquisition/cleanup across unowned helpers or issue a write before the authorization/version check just to shorten an adapter.

For an existing public signature spanning many lines, inspect whether the domain genuinely needs a cohesive parameter value and whether changing that API is authorized. Do not compress formatting, bundle unrelated arguments into a generic record or quietly break callers. Report a contract/scope conflict and coordinate the required change while completing independent work; the limit still remains unmet.

Large pattern matches or state transitions may need cohesive case handlers and a small dispatcher. Keep the state model and exhaustive/error policy authoritative; avoid spreading one invariant into each handler. Do not replace clear control flow with an inscrutable lookup table or generic interpreter to make it physically shorter.

## Review complexity below the cap

Check whether a reader can state the function's job, required inputs, result/error and effects without tracing a chain of unrelated helpers. Inspect nested conditionals, repeated predicates, boolean arguments, mixed units, hidden globals and callback-heavy expressions. Flatten control flow with meaningful guard clauses or explicit states where that preserves behavior.

Do not invent a universal cyclomatic score or reject an idiomatic loop solely for iteration. The hard size cap is ten; complexity findings still need a concrete readability or correctness consequence. A short pure calculation, necessary adapter or existing clear helper can receive a clean verdict.

## Tests and verification

Test functions and callbacks follow the same cap. Keep distinguishing case inputs and assertions understandable; use cohesive typed fixtures or parameterized cases without obscuring independent failures. Do not weaken a regression, replace its oracle with the implementation or drop cases to shorten a test. Existing test-economy and coverage rules still apply.

After a split, exercise the actual consumer and relevant failure path, not only each helper independently. Retain numerical precision, input ownership, ordering, resource cleanup, authorization and retry behavior. Update imports/exports/generators and inspect the integrated result. Report inspected definitions, violations and unavailable analysis separately from behavior checks.

These are authored counting and refactoring rules. They supply no automatic function checker or evidence that an arbitrary repository already complies.
