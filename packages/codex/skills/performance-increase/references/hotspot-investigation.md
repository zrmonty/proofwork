# Investigate the work that dominates

Select instruments explaining the symptom. Separate request queue wait, computation, downstream calls, transfer and rendering; retained memory from transient allocations/peak buffers; saturation, retries, contention and backpressure; startup from steady-state work. Idle CPU may mean I/O wait.

Use representative sanitized/synthetic distributions. Repeated versus unique keys, data exceeding memory, contention and cold caches change bottlenecks. Never export private production data for convenience.

## Connect observations to bounded changes

| Observed work | Candidate | Contracts/costs to preserve |
| --- | --- | --- |
| Repeated multidimensional scans | One owned lookup/improved algorithm | Equality, duplicates, order, construction and memory |
| Repeated parsing/serialization | Parse once at boundary | Validation, wire format, lifecycle and retention |
| Tiny repeated I/O | Ownership-bounded batching | Partial failures, retries, order, transaction size and latency |
| Intermediate arrays/copied buffers | Fusion, streaming or safe borrowing | Caller ownership, lifetime, cleanup and peak memory |
| Database cost | Inspect plans/queries/justified indexes | Results, transactions, write/storage cost and cardinality |
| Repeated cross-request work | Measured scoped cache | Authorization, freshness, invalidation, bounds and misses |
| Independent waiting I/O | Bounded concurrency | Capacity, backpressure, cancellation, order and cleanup |

Indexes can lose on small inputs; batches can increase latency/locks; concurrency can worsen saturation. Report crossover ranges. Probe collisions/skew, long strings, misses and partial failures where mechanisms warrant them. Bound retention/lifetime, not just allocation count. Tiny warmed fixtures can conceal growth.

## Incumbent language tools

**TypeScript/JavaScript:** measure emitted production code on its actual runtime. [Node performance APIs](https://nodejs.org/api/perf_hooks.html) and existing profiling distinguish CPU, event-loop delay and async waits. Await completed work/consume results; include relevant JIT/GC variation. Node timings do not prove browser flows. Avoid blocking the main thread to save Promise overhead.

**Rust:** inspect target/features and [Cargo's bench contract](https://doc.rust-lang.org/cargo/commands/cargo-bench.html). Optimized profiles do not make unstable #[bench] available on stable; retain established custom harnesses. Prevent optimized-away work through consumption/black-box boundaries, verifying outputs outside timing. Optimize clones/formatting/conversions only when observed. Safe borrowing/private accumulators outrank speculative unsafe rewrites.

**Python:** separate interpreter, library, startup, serialization and I/O costs. [timeit](https://docs.python.org/3/library/timeit.html) excludes setup and normally disables GC; disclose boundaries/account for collection. Best-case numbers do not prove service tails. Include conversions/intermediate allocations in library comparisons. Processes add serialization/lifecycle costs.

**SQL:** inspect actual plans with realistic statistics. SQLite [EXPLAIN QUERY PLAN](https://www.sqlite.org/eqp.html) is diagnostic, version-dependent text, not a stable parser contract. Measure equivalent results/read benefit plus write cost. Caching cannot replace required transactions/freshness.

Check installed versions/conventions before flags. One local improvement does not justify a universal cache/service layer.

## Membership example

A per-request identifier set may replace repeated scans while preserving member order. Establish equality/duplicates; compare empty, small and representative large inputs. Include set construction in operation timing. An artificially reused set winning does not prove the actual request improved. Report workload limits rather than a universal claim.
