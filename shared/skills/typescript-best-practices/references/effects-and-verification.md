# Effects and verification

## Own asynchronous work

Choose async structure from the failure policy:

| Need | Useful shape | Question to settle |
| --- | --- | --- |
| Independent reads must all succeed | `Promise.all` | May still-running reads safely finish after rejection? |
| Report every outcome | `Promise.allSettled` | Who handles each rejection? |
| Writes must occur in order | Sequential await | What happens after a partial write? |
| Process a large queue | Existing bounded worker facility | What limits work, retries, and resource use? |
| UI requests supersede old ones | Cancellation and request identity | Can obsolete responses still update state? |

`Promise.all` rejection does not itself cancel siblings. Never launch writes in parallel merely because the syntax is compact. A detached promise needs an owner that records failure; prepending `void` only changes the expression's use.

For search as you type, cancellation may be insufficient if an API ignores its signal or work already finished. Before committing a result, compare its request identity with the current one. Use the framework's existing facility when it provides the guarantee. Verify a slow earlier response arriving after a later response, a failure, and teardown.

For external writes, distinguish confirmed failure, confirmed success, and unknown outcome. A timeout may occur after the remote side committed. Decide whether retrying is safe from the API contract, not the exception's name. Preserve the existing error convention and useful causes; sanitize user messages rather than leaking response bodies or credentials.

## Preserve input ownership

`items.sort()` modifies the input array. Copying before sorting preserves its order:

```ts
type Page = Readonly<{ position: number; title: string }>;

function orderedPages(pages: readonly Page[]): Page[] {
  return [...pages].sort((left, right) => left.position - right.position);
}
```

The array is new; page objects remain shared. That is fine because this function only reorders them. If later code edits nested content, copying the array alone is insufficient. Test the preservation actually promised. [Readonly types](https://www.typescriptlang.org/docs/handbook/2/objects.html) describe static access constraints.

## Respect runtime modules and resources

Before changing imports, check package `type`, compiler module/resolution settings, exported entry points, and the executor or bundler. Compiling does not establish that an emitted path loads in the target runtime. Follow [TypeScript's module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html) for the selected mode; do not change modes to accommodate a snippet.

Use type-only imports for type-only dependencies where consistent with project conventions. Keep side-effect imports explicit. Avoid barrels that introduce cycles or load unrelated effectful modules solely to shorten paths.

For handles, subscriptions, streams, timers, and sockets, identify creation and release. Use established cleanup constructs, including finally where ownership requires it. Check both compiler and runtime support before adopting newer resource syntax. An abstraction acquiring a resource must not hide who closes it.

## Select checks from the boundary

- Decoder: malformed shape, valid limits, and actual adapter error response.
- State variant: typecheck handlers and test the new observable state.
- Pure transform: empty/single/multiple inputs and unchanged caller data.
- Async behavior: controlled response ordering and failure, rather than sleeps alone.
- Module/API: compile and run a consumer under its real configuration.
- UI state: visible interaction and cleanup using existing test/browser tools.

Do not introduce a runtime, schema library, or test harness merely to use this skill. Report executed checks and supported configurations. A runtime that strips TypeScript syntax can execute examples without proving their types; label those forms of evidence separately.
