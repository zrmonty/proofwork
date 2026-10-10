# Language fit

Choose the implementation technology that fits the work. No language or framework gets a preferred position because it is popular, familiar to an agent or already used in a template. A fair comparison can choose TypeScript, Rust, Python or something else; explain which real requirement selects it.

Use this skill for new language/framework choices, a consequential technology review or a justified implementation migration. Pair with architecture-fit: it decides which components and boundaries are needed; this skill selects their implementation technology. Preserve a suitable incumbent for focused fixes. A recommendation does not authorize installing dependencies, rewriting a product or deploying a new service.

## Partition responsibilities before choosing tools

Inspect the ordinary-language brief, accepted direction, existing code, target platforms, available skills/toolchains and operating owner. Describe systems, scripting/automation and fullstack/UI responsibilities. These are evaluation categories, not three mandatory services or languages. A small project may need only one deployable application; an automation can be a function or scheduled command within it.

Identify each responsibility's concrete workload: CPU versus I/O, sustained and burst throughput, latency distribution, concurrency, startup, memory bounds, numeric/data semantics, failure/recovery needs and integrations. Ask about material unknowns in practical terms. A trading dashboard, research/backtest tool and execution engine have different requirements despite the same domain label. Do not infer a hard real-time deadline or live execution authority from "trading app."

Distinguish language, runtime, framework, rendering architecture and library ecosystem. Vue versus React is a framework decision; it does not require choosing or rejecting TypeScript. A Python automation may spend its time in native libraries or remote I/O. A Rust server can still spend its latency budget in serialization, storage or networking. Trace the actual expensive responsibility before recommending a rewrite.

## Give credible alternatives a fair hearing

Begin with requirements and exclusion reasons, not a preferred stack. Include the incumbent when present, a simpler adequate arrangement and materially different credible alternatives. Consider the candidate families below and expand beyond them when the target ecosystem supplies a better fit. This is a starting map, not an exhaustive ranking or a demand to prototype every framework.

| Responsibility | Candidate families to investigate | Decisive questions |
| --- | --- | --- |
| Systems / critical execution | Rust, C++, C; Zig or platform-specific alternatives; Go, JVM or .NET when their runtime tradeoffs fit | Which deadlines, memory/resource control, native APIs, portability, safety and maintained tooling matter? |
| Scripting / automation | Python, JavaScript/TypeScript, Ruby, shell/PowerShell, Lua or existing platform tools | Which libraries, scheduler, host, failure semantics, typed boundaries and operational owner fit the actual job? |
| Fullstack / services | Go, Python, Ruby, PHP, Java/Kotlin, C#/.NET, Elixir/Erlang, Rust, JavaScript/TypeScript and their relevant frameworks | Which workflow, integration, concurrency, deployment, maintenance and delivery requirements select a fit? |
| Frontend / presentation | Server-rendered HTML with progressive enhancement; Vue/Nuxt, React and suitable rendering frameworks, Svelte/SvelteKit, Angular, Astro, Solid or target-platform UI tools | How much interaction, initial content, accessibility, update volume, device budget and ecosystem support is required? |

Compare maintained/version-compatible libraries, required protocols, target OS/CPU/browser, deployment constraints, diagnostics, testing, onboarding and total ownership cost. Verify current support and consequential technical claims in official primary documentation. Missing bundled language guidance is a capability gap to address with appropriate primary sources and concrete checks, not a reason to default to a covered language or pretend C/C++ expertise is bundled.

For a throughput- or latency-critical native responsibility, read [systems and mixed-language boundaries](systems-and-boundaries.md). Seriously evaluate Rust, C++ and C against the measured budget and integration needs; keep other candidates in contention when they meet it. A native language can be justified for the critical subsystem without rewriting the dashboard and automation. Never claim a language alone guarantees throughput, determinism or safety.

For browser or fullstack choices, read [frontend and application fit](frontend-and-application.md). Compare equivalent user journeys and rendering strategies, including minimal/no client framework where adequate. Do not pick React by habit or Vue from an unsupported universal speed claim.

## Make each additional language earn its boundary

Compare a single-language arrangement with the proposed mixed stack. Count toolchains, dependency updates, builds, deployment units, observability, local setup, serialization, data copies, schema changes and operators. A useful library boundary does not require a separate process; a separate process does not automatically require a distributed service.

Map ownership of domain decisions and persisted state. Match the existing dominant style. Extract a pure transition when the changed workflow has at least three meaningful states or event types, a real partial-failure/retry path, or domain logic needing tests without its framework; otherwise follow surrounding code. Effects retain their authoritative owner. Record numeric precision, errors, cancellation, timeouts, idempotency, ordering, compatibility and versioning across any language seam. Do not duplicate business rules in the frontend, Python script and Rust engine or let UI validation authorize server changes.

A Vue interface, Python automation and Rust engine is a candidate arrangement, not the default answer. Use it when the interface workload, Python integration ecosystem and native critical path each provide a demonstrated reason that outweighs boundary costs. Otherwise recommend the simpler adequate stack and name what evidence would justify a future split.

## Recommend with evidence and an affordable next step

Return a concise responsibility matrix: workload/constraints, candidates, selected or provisional choice, reason serious alternatives did not fit, tradeoffs, operating owner and decisive evidence still needed. Give a recommendation rather than an unranked catalog. Respect an explicit user mandate while identifying unmet requirements; do not silently replace it.

When performance decides the choice, load performance-increase and use representative comparable release-mode trials. Its actual before/after or incumbent/candidate table, variation, correctness checks and practical interpretation belong in the user-facing result. For a greenfield choice without measurements, present a hypothesis and bounded comparison plan; no invented benchmark, universal framework ranking or unsupported capacity guarantee.

Apply relevant bundled language skills only after the implementation choice or actual file scope warrants them. Python remains strictly typed; Rust ownership/resource guidance and functional, security and coverage requirements remain in force. A runtime/framework choice cannot waive a quality gate.

State the smallest authorized implementation or migration step, preserved contracts and an observable reopening condition. A choice-only request ends with the decision and its evidence gaps. Do not scaffold a preferred stack while calling the alternatives "considered."
