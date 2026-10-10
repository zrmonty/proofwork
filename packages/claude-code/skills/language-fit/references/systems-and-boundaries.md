# Systems workloads and mixed-language boundaries

Read for latency/throughput-critical work, native integration or a proposed systems/scripting split. These are original decision scenarios, not measured product benchmarks.

## Locate the critical path

For a trading product, separate display/administration, research/automation and actual order/risk processing. Ask what constitutes a completed operation, what burst load is offered, which latency percentile or deadline matters, what must be ordered, and how recovery works. Use synthetic/replayed workloads for authorized evaluation; a stack-choice request does not permit live orders, credentials or financial actions.

Bound decode, validation, risk decisions, state transitions, serialization, persistence and network delivery separately. A fast calculation cannot rescue a slow durable write, queue buildup or external API delay. Preserve numeric representation and rounding, duplicate suppression, replay, authoritative permissions and cancellation/uncertain-outcome semantics in every candidate.

## Compare implementation control and integration

Evaluate Rust when its ownership/resource model, libraries and target support fit the work. Evaluate C++ when maintained native SDKs, an incumbent engine, toolchain and responsible team provide a concrete advantage. Evaluate C when a target ABI, embedded constraints or existing small native component warrants its manual resource and error-management burden. Check Zig or other target-supported options when they address a material constraint. Evaluate managed runtimes too when their measured pause, allocation and throughput behavior fit the budget.

Do not infer that C is always faster than C++, that Rust prevents every correctness error, or that any garbage-collected runtime necessarily fails a deadline. Compare actual algorithms, release settings, allocation/cleanup, contention, device/runner and completed work. Unsafe/foreign code still needs explicit contracts and checks. For C/C++, use relevant compiler diagnostics, sanitizers and resource/error tests; no such tool execution is established by choosing a language.

If a workload has a genuine hard deadline, identify the runtime/OS/device guarantees and evidence needed. A low average or a few observed p99 samples do not prove a worst-case execution bound. State unsupported determinism instead of certifying the language label.

## Pay for the seam you introduce

Compare in-process modules, a binding and an explicit process/API boundary by required isolation and integration, not enthusiasm for multiple languages. Account for packaging on each platform, runtime initialization, copies, encoding, ABI/schema evolution, deployment and observation of failures. Preserve ownership and lifetimes across FFI; exceptions/panics, callbacks, interpreter execution rules and native threads require documented treatment.

For Python orchestration and a native core, verify whether the required integration already exposes the native work. A direct script may be adequate when external I/O dominates. If Python calls Rust/C++ through a binding, measure marshalling and batch size as well as the native operation. A process boundary can avoid shared-memory hazards but adds delivery, version and cancellation contracts. Neither arrangement earns a blanket preference.

Keep one authoritative owner for the domain transition. Define whether a failed/timeout request could already have committed, and which observation resolves that uncertainty. A second implementation of risk rules in the script creates drift, even if each benchmark is fast.

## Sources for checking concrete contracts

Use the [Rust FFI guidance](https://doc.rust-lang.org/nomicon/ffi.html) for relevant native boundary questions, [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) for applicable ownership/resource/performance review, and [Python extension/embedding documentation](https://docs.python.org/3/extending/index.html) for its actual native integration. Consult documentation matching the selected compiler/runtime/version. These sources guide verification; they do not establish a relative-speed winner or certify the proposed application.
