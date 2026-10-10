# Language and framework fit

Select technology from inspected requirements, not popularity, templates or agent familiarity. Preserve an adequate incumbent for focused fixes. Pair with architecture-fit for component boundaries; a recommendation alone does not authorize migration, dependencies or deployment.

## Partition responsibilities, not services

Inspect brief, accepted direction, existing code, platforms, available toolchains and operating owner. Identify systems, scripting/automation and presentation/fullstack work as evaluation categories, not three mandatory languages or services. A small product may be one application with scheduled functions.

Describe concrete CPU/I/O work, sustained/burst throughput, latency distribution, concurrency, startup/memory limits, numeric semantics, integrations and recovery. Ask material unknowns in practical terms. Trading dashboards, backtests and execution engines have different requirements; “trading” does not establish hard real-time deadlines or execution authority.

Distinguish language, runtime, framework, rendering and libraries. Vue versus React does not decide TypeScript. Python may spend time in native libraries or remote I/O; Rust may wait on storage/serialization. Trace the actual expensive responsibility before proposing replacement.

## Compare serious candidates

Include the incumbent, a simpler adequate arrangement and credible materially different alternatives. Exclude by requirements, not preference. The following are families to investigate, not rankings or a demand to prototype every option:

- Systems: Rust, C++, C, Zig, platform-native choices; Go/JVM/.NET where their runtime tradeoffs fit deadlines, resource control, safety and native APIs.
- Automation: Python, JS/TS, Ruby, shell/PowerShell, Lua or existing platform tools selected for libraries, scheduling, host and maintainers.
- Services/fullstack: Go, Python, Ruby, PHP, Java/Kotlin, C#/.NET, Elixir/Erlang, Rust, JS/TS and relevant frameworks selected for integration, concurrency and operational cost.
- Presentation: server HTML/progressive enhancement, Vue/Nuxt, React, Svelte/SvelteKit, Angular, Astro, Solid or platform UI selected for real interaction, initial content, accessibility, devices and support.

Check version-compatible libraries/protocols, target OS/CPU/browser, deployment, diagnostics, testing, onboarding and ownership cost. Verify current consequential claims in primary official documentation. Missing bundled guidance is a capability gap, not a reason to default to covered languages or claim absent expertise.

Read [systems boundaries](systems-and-boundaries.md) for throughput/latency-critical native work. Seriously evaluate Rust/C++/C against measured budgets while retaining adequate other candidates. Native execution can serve one subsystem without rewriting its dashboard. No language guarantees speed, determinism or safety alone.

Read [frontend fit](frontend-and-application.md) for comparable user journeys and rendering strategies, including minimal client frameworks. Neither habitual React nor universal Vue-speed claims establish fit.

## Make boundaries earn their cost

Compare single-language and mixed arrangements: toolchains, upgrades, builds/deployments, local setup, observability, serialization/copies, schemas and operators. Library boundaries need not become processes/services. Name canonical domain/state owners; never duplicate authorization or business policy across UI/scripts/engine.

Match dominant style. Extract pure transitions for at least three meaningful states/event types, real partial-failure/retry, or framework-independent decision testing; otherwise preserve surrounding shape. Record numeric precision, errors, cancellation, timeouts, idempotency, ordering and version compatibility at seams.

Vue/Python/Rust is a candidate only when each responsibility earns its complexity. Prefer simpler adequate arrangements and state what evidence would justify splitting later.

## Recommend with evidence

For each serious candidate, record a project-specific acceptance threshold and observed result for the deciding constraints: p95/p99 latency, throughput at stated concurrency, peak memory, startup, correctness, deployment support and maintenance burden. Include boundary serialization and dependency costs. Use equivalent algorithms, release settings, data and hardware; publish commands and variability. A faster microbenchmark does not justify rewriting an I/O-bound journey.

When uncertainty could change an expensive choice, generate two bounded prototypes against one acceptance brief, preferably with distinct configured models when host capability and authority permit. Keep candidates isolated; cap trials, time and spend before dispatch. An independent reviewer compares anonymized artifacts and measurements. Preserve the cheapest adequate incumbent unless a demonstrated requirement justifies replacement; do not combine winners without rerunning the shared checks. Label unavailable cross-model execution and unmeasured estimates explicitly.

Return responsibility/workload, candidates, selected/provisional choice, serious exclusions, tradeoffs, operating owner and missing decisive evidence. Respect explicit user mandates while exposing unmet needs. Give a recommendation, not an unranked catalog.

When performance decides, use [performance-increase](../../performance-increase/SKILL.md) for representative comparable release trials, variability, correctness and the actual user-facing comparison table. Greenfield estimates stay hypotheses with bounded measurement plans, never invented benchmarks.

Apply relevant language guidance after actual selection/file scope. Strict Python typing, Rust ownership/resource obligations and executable coverage/security gates remain. End a choice-only request with its decision, smallest authorized next step, preserved contracts and reopening condition; do not scaffold while claiming alternatives were considered.
