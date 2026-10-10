# Investigate the work that dominates

Read this reference for product-code optimization. Select the measurements that explain the symptom; do not run every instrument or change every item below.

## Follow cost through the operation

For a slow request, separate queue wait, computation, downstream calls, data transfer and rendering. For memory pressure, distinguish retained objects from transient allocations and peak buffer size. For poor throughput, inspect saturation, retries, contention and backpressure; an idle CPU can indicate an I/O wait rather than inefficient arithmetic. For startup, inspect module loading, initialization and first-use work separately from steady-state execution.

Measure the relevant path with representative inputs, including the shape that makes it expensive. A thousand records with repeated keys behaves differently from a thousand unique records. A dataset larger than memory or a shared resource under contention can reveal a different bottleneck from an isolated hot-cache microbenchmark. Use sanitized or synthetic inputs with the relevant distribution; do not export private production data for convenience.

An optimization opportunity should connect an observation to a change and a check:

| Observation | Candidate change | Semantics and cost to verify |
| --- | --- | --- |
| Repeated scans grow with two input dimensions | Build an owned lookup once; use an algorithm with less repeated work | Equality rules, duplicates, output order, index construction and memory |
| Repeated parsing or serialization dominates a request | Parse once at the boundary; retain a suitable internal representation | Validation, lifecycle, exact wire contract and retained memory |
| Many tiny I/O operations dominate | Batch within the operation's ownership boundary | Partial failures, retry behavior, ordering, transaction size and latency |
| Large intermediate arrays or copied buffers dominate allocations | Fuse local transformations, stream where appropriate, or borrow safely | Caller ownership, buffer lifetime, cleanup and peak memory |
| Database time dominates | Inspect queries and plans; remove repeated queries or add a justified index | Results, transaction behavior, write/storage overhead and production cardinality |
| Duplicate expensive work repeats across requests | Consider a scoped cache only after measuring reuse | Invalidation, freshness, authorization scope, bounded memory and cold misses |
| Work waits on independent bounded I/O | Consider bounded concurrency | Downstream capacity, backpressure, cancellation, ordering and failure cleanup |

Do not assume a constant-factor rewrite beats the existing implementation. Index construction can lose for small inputs. A larger batch can increase latency or lock duration. Concurrency can make a shared resource slower. Record the actual useful range instead of concealing the crossover.

Test distributions that exercise the changed mechanism: collisions or skew for lookups, long strings for parsing, repeated misses for caches, and partial downstream failures for batching. Bound retained memory and lifetime, not just the allocation count in one operation. A cache warmed with a tiny fixture can hide unbounded growth; a batch that succeeds only when every item succeeds has not preserved error semantics. Evaluate only the relevant risks rather than expanding each task into a generic stress campaign.

## Preserve the language's useful tools

Read only the subsection matching the implementation. Check the installed tool and repository conventions before using version-dependent flags.

**TypeScript and JavaScript.** Measure the emitted production code under its actual runtime. In Node, [performance measurement APIs](https://nodejs.org/api/perf_hooks.html) provide timing and observation facilities; use existing runtime profiling to distinguish CPU, event-loop delays and asynchronous waits. Await the operation being measured and consume its result. Include JIT warm-up and garbage-collection variation where relevant. A fast Node function does not prove a browser interaction is fast; measure the actual browser flow for frontend claims. Avoid making the main thread do more blocking work to reduce Promise overhead.

**Rust.** Inspect the configured benchmark target and features. [Cargo's benchmark command](https://doc.rust-lang.org/cargo/commands/cargo-bench.html) uses an optimized bench profile by default; its built-in `#[bench]` facility is unstable, so preserve an existing stable custom harness. Prevent optimized-away work with the harness's result-consumption mechanism or an appropriate black-box boundary, and validate outputs outside the timed region. Repeated clones, formatting and owned conversions are candidates only when their cost is observed. Borrowing or an owned private accumulator is preferable to introducing unsafe code for a marginal result.

**Python.** Separate interpreter work from library calls, process startup, serialization and I/O. [timeit](https://docs.python.org/3/library/timeit.html) supports repeated small-code measurements but excludes setup and normally disables garbage collection; disclose those boundaries and account for collection when it matters. A timeit best-case number does not establish service tail latency. Prefer existing data structures or library operations when they remove interpreted repeated work; include conversion and intermediate-allocation costs. Verify behavior before choosing processes, which introduce serialization and lifecycle costs.

**SQL.** Inspect a plan for the actual query and realistic statistics before choosing an index. SQLite's [EXPLAIN QUERY PLAN](https://www.sqlite.org/eqp.html) distinguishes scan and search strategies; its output is diagnostic and may change, so do not build a durable machine parser around its text. Measure result equivalence and read benefit together with write cost. Caching a result cannot replace a required transaction or freshness guarantee.

## Example of a bounded improvement

A request builds an ordered list of members allowed by a set of identifiers. The implementation scans every identifier for every member. A per-request set may reduce repeated membership work while keeping the member traversal in the same order. First establish identifier equality and duplicate behavior, then compare empty, small and representative large inputs. Include construction of the set in the operation timing. If only an artificially reused set wins, it is not evidence that this request became faster.

Keep the resulting implementation proportionate. One local index does not justify a universal cache layer or a new service.
