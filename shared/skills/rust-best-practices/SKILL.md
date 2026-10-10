---
name: rust-best-practices
description: For Rust changes involving ownership, borrowing, async, atomics or unsafe invariants.
---

# Rust best practices

Match the existing codebase's dominant style before a functional preference. Load functional-programming only for stateful workflows, retries, concurrency, caching or shared mutable state and apply its extraction test; otherwise follow surrounding code.

Make ownership, valid states and failure policy clear to callers. Inspect Cargo manifests, minimum compiler version, edition, feature/target assumptions and affected consumers before changing a contract.

Rust has no universal function cap. Project-local caps must exempt safety comments, match arms and select! loops; lift them for unsafe wrappers.

Borrow for observation, own consumed or retained values, and clone only for intended ownership semantics. Shared references and Arc clones do not create independent referents. Keep checked numeric policy, recoverable errors and validated construction explicit.

Prefer pure domain decisions with clearly named inputs, next state and intended effects. Adapters own authority checks, versioned commits and observed effects. Ordinary loops and private mutation are valid when they preserve caller data and make bounds clear. Select synchronization from the invariant; tests cannot establish unsafe soundness.

Use the [topic guide](references/topic-guide.md) to select ownership, collections, iterator item types, text, conversions, generics and numeric detail. For nontrivial implementation or review, read [implementation contracts](references/implementation-contracts.md). Load [worked contracts](references/worked-contracts.md) when runnable examples resolve uncertainty. Advanced API, async, performance, unsafe and atomic references are selected through those guides; do not preload them all.

Run configured formatting, Clippy and affected tests. Check changed invariants and public consumers; executable work follows [tdd-95](../tdd-95/SKILL.md). Unsupported coverage, untested feature/target combinations and concurrency or soundness assumptions stay visible. Report exact checks and evidence rather than implying every configuration passed.
