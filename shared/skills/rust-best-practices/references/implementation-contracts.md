# Rust implementation contract selector

## Must

- Must load references answering the actual changed contract.
- Must name owners, output lifetimes and partial effects.
- Must preserve the incumbent style and supported toolchain.
- Must keep validation and authoritative commit boundaries visible.
- Must protect cohesive safety proofs from size-driven fragmentation.
- Must return executed evidence and remaining assumptions.

Use this reference to connect a change's ownership, domain and runtime obligations. Load the focused reference that answers an actual question; do not load the entire library.

Record the affected public consumers, supported compiler/edition/features/targets, input owner, output lifetime, recoverable failures and partial-effect policy. Use incumbent libraries and runtime conventions. Concrete helpers remain concrete unless a real consumer needs variation. Do not add dependencies, editions or blanket lints as incidental cleanup.

## Select the missing contract

- Syntax, builds and supported toolchains: [foundations](foundations-and-toolchain.md).
- Basics through traits: [topic guide](topic-guide.md); exact executable examples: [worked contracts](worked-contracts.md).
- Borrowing, validated values, numeric decisions and errors: [ownership and domain](ownership-and-domain.md).
- Shared ownership, cleanup and claim-specific checks: [resources and verification](resources-and-verification.md).
- Consumer/API/feature evolution: [downstream compatibility](downstream-compatibility.md).
- Recovery taxonomy and versioned state proposals: [APIs and transitions](api-errors-and-transitions.md).
- Task lifetimes, partial I/O, admission and shutdown: [async contracts](async-cancellation-and-backpressure.md).
- Atomic synchronization and publication: [memory ordering](atomics-and-memory-ordering.md).
- Allocation, retention and representation: [performance](performance-and-representation.md).
- Unsafe storage, callbacks and foreign boundaries: [unsafe invariants](unsafe-ffi-and-invariants.md).

Match existing style. For meaningful state/retry/partial-failure decisions, separate deterministic proposals from authoritative commit/effect handling when useful. Name the owner of every effect and failure. A pure proposal does not prove atomic persistence; borrowed/shared handles do not prove independent ownership; typed input does not prove validation; passing tests do not prove soundness.

Proofwork imposes no universal function cap. If a project adopts one, exclude safety comments, match arms and `select!` loops from its count. Lift the cap for unsafe wrappers when splitting would scatter their safety proof; retain clear responsibilities and reviewable invariants.

Return the changed contracts, executed evidence and remaining assumptions. Apply [tdd-95](../../tdd-95/SKILL.md) to executable changes with real independent source/line/branch measurements; unavailable metrics stay unverified. Public API claims need a real consumer, performance claims measured workloads, and resource claims lifecycle/failure evidence.
