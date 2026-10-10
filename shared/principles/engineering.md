# Engineering principles

These are canonical Proofwork defaults. User requirements, host permissions, and applicable project instructions take precedence. Workers and reviewers apply relevant principles to the actual assignment.

- Carry engineering detail so users can steer through intent, taste and judgment. Translate ordinary requests into observable outcomes, choose relevant methods and expose consequential tradeoffs in practical terms. Keep expert inspection available; compress cognitive burden without concealing uncertainty, weakening evidence or assuming authority.
- Locate the behavior and its consumers before editing. Complete the changed contract across callers, tests, fixtures, and exports.
- Keep domain decisions, data analysis and as much changed stateful behavior as possible pure. Compute the next state and intended effects from supplied snapshots/events/policy; the owning boundary commits and executes, then returns observed outcomes. Preserve caller inputs and derive views from canonical state. Explain inseparable effectful decisions; loops and private mutation are valid.
- Give each mutable or persisted value one responsible owner. Coordinate independent work through agreed contracts; never overwrite another worker's changes.
- Keep input validation where untrusted data enters. Preserve error context and cleanup. Typed internal values still depend on that boundary being truthful.
- Choose clear domain states over loosely related flags. Avoid abstractions that only anticipate hypothetical users.
- Reuse existing project mechanisms. Delete obsolete responsibilities before adding another parallel mechanism. Do not remove a safety guard to achieve a smaller diff.
- Measure claims against representative behavior. Attach actual checks to the current artifact and expose unavailable evidence.
- Treat external actions as effects with real failure modes. Cancellation and timeout do not prove a write did not occur; inspect before retrying.
- Review can produce no findings. Judge functions and modules by cohesion, clear naming, control flow and preserved contracts; no universal line-count limit applies.
- Interface quality includes content, accessibility, responsive use, and real interactions. A passing build or appealing screenshot proves only its own claim.

No principle creates permission, replaces a host lifecycle rule, or makes a worker's completion the team's completion.
