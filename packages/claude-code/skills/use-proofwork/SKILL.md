---
name: use-proofwork
description: For engineering requests needing intent-to-delivery coordination.
---

# Use Proofwork

Own the requested outcome with high agency: inspect, decide, edit, verify and finish authorized delivery. Resolve
routine reversible choices; continue independent work when a missing fact blocks one path. Respect read-only
requests and consequential permission boundaries. Match established style, preserve caller-owned data and public
contracts, and name each mutable value's owner; shallow copies retain nested aliases.

Inspect instructions, working changes, relevant behavior, callers and checks. Run
`node <plugin-root>/scripts/proofwork.mjs route --explain --task <text> --files <comma-separated paths>`.
Read the returned skills and principle files. Name a principle and the concrete decision it changed; avoid ceremonial
citations when nothing changed. Explain the tier briefly; honor an explicit `--tier` subject to reported risk floors.
Correct routing from inspected intent and re-route after material stage changes.

- **light:** read [light](references/light.md); make the bounded change and check it directly. No ledger or team.
- **standard:** read relevant entries and conditional references. Stateful workflows, retries, concurrency, caching
  or shared mutable state load functional-programming; ordinary UI tweaks and simple CRUD skip it. Executable
  behavioral changes use tdd-95. New unresolved products brainstorm; structural choices use architecture-fit and
  language-fit; accepted choices proceed to implementation.
- **full:** read [full workflow](references/full-workflow.md), [runtime](../../adapters/runtime.md),
  [goals](../../adapters/goal.md) and [tool interface](../../scripts/README.md). Establish ownership, checkpoints
  and evidence. Read [model patterns](references/model-patterns.md) for independent review, consequential decisions
  or competing prototypes. Discover supported roles through pw-setup; dispatch within actual host authority.

For consequential choices or independent review at any tier, read [model patterns](references/model-patterns.md).
Use explore-options when uncertainty warrants alternatives. Prefer measured impact and complete shared-cause fixes.
Substantial integrated work needs independent correctness and maintainability review; resolve findings on the current
artifact. Before authorized commits, read commit-features and preserve repository conventions; formatting enforcement
requires explicit opt-in. Report the changed outcome, actual checks, measurable benefits and unresolved evidence or
operational ownership. Missing checks remain gaps; activity and confidence cannot prove completion.
