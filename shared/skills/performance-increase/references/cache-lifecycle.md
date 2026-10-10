# Cache lifecycle and bounded reuse

Read this when a measured bottleneck suggests caching or memoization, or when a warm benchmark conceals stale results, retained memory or miss behavior. Do not introduce a cache merely because repeated calls exist.

## Establish reusable work

A dashboard repeatedly derives a total from the same organization snapshot. Memoizing by organization ID alone is fast until the snapshot, policy or caller permissions change. The cache returns an old or unauthorized answer while a benchmark of one unchanged fixture looks excellent.

Identify every dependency of the calculation: source identity/revision, relevant policy, user/tenant scope, effective time and representation. A pure function with complete explicit inputs makes this inventory easier; purity alone does not give an inexpensive stable key or a safe cache lifetime.

| Candidate | Decision | Cost or failure to measure |
| --- | --- | --- |
| Repeated work within one operation | Reuse an owned local result | Construction and retained data |
| Immutable versioned snapshot across calls | Key by actual complete identity | Cold misses, invalidation and capacity |
| Rapidly changing or unique inputs | Recompute may be cheaper | Key-building and low hit rate |
| Mutable returned collection | Return an ownership-safe result | Copy cost or cross-caller mutation |
| Concurrent misses | Use incumbent bounded coordination if needed | Duplicate work, waiting and failure cleanup |

The simplest useful optimization may be calculating once within one request. That needs no shared cache, expiration mechanism or new service.

## Define the owner and invalidation policy

Keep cache reads/writes and lifecycle with an explicit effect owner. Pure rules can calculate keys, eligibility and invalidation decisions from supplied values; they should not consult or mutate an ambient cache while calculating the domain result.

Choose an invalidation policy from the actual freshness contract. Expiration permits bounded staleness only when the product accepts it; it is not a substitute for current authorization. Invalidate or isolate relevant entries when policy, identity or underlying data changes under the existing mechanism.

Bound memory and work by relevant size, not merely entry count. One entry can retain a large graph or buffer. Account for evicted objects that remain referenced, pending computations and error records. Do not cache transient failures indefinitely or make a cache miss into a false empty success.

For Python implementations using the standard cache facilities, [functools documentation](https://docs.python.org/3/library/functools.html) describes retained arguments/results and concurrent-call limits. Match the installed interpreter. A thread-safe cache does not by itself guarantee a computation runs only once on a concurrent miss.

## Measure an honest lifecycle

Compare baseline and candidate over representative distinct keys and changes, not just one warmed key. Include key construction, lookup, result copying and miss computation in the requested operation boundary. Use observed or justified hit/miss distributions; do not invent a production hit rate from a microbenchmark.

Measure cold, warm, invalidated and relevant concurrent-miss cases separately. Check retained memory as the working set grows and the eviction boundary is reached. Include failures and timeouts in service outcomes; clearing the cache between every sample or never clearing it answers different questions.

Verify results against an independent uncached path where trustworthy, including permission/policy changes and returned-value edits. A faster cache that changes freshness, disclosure or caller ownership fails correctness before its timing is accepted.

## Stop when reuse does not pay

If construction, misses, coordination or retention erase the measured benefit, remove the ineffective mechanism. Keep a simpler per-operation reuse when it independently helps. Do not preserve speculative cache machinery for a possible future workload.

Report the measured workload and cache policy, comparable timings, observed hit/miss counts, resource costs and correctness checks. Fixture observations do not establish production hit rate, capacity or provider behavior.
