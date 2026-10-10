# Bounded model patterns

Use model-role planning from pw-setup and the host runtime adapter. Absent configuration preserves the session
model. Configured roles are requests, not proof that dispatch works. Record requested and observed model/effort,
or unknown, for every assignment. Never silently substitute a provider or weaken evidence when access fails.

## Pick a pattern

| Uncertainty | Pattern | Starting budget |
| --- | --- | --- |
| Consequential choice with plausible alternatives | Isolated candidates, then reasoner selects | Two candidates |
| High-risk integrated behavior | Blind correctness and maintainability reviewers | Two reviewers |
| Security, retry, migration or ownership assumption | Challenger searches counterexamples | One challenger |
| Mechanical edits or established routine behavior | Direct implementation and relevant checks | No extra agents |

Different models can expose different mistakes; provider diversity is not independence. Give reviewers the brief,
contracts and artifact without the author's verdict. Give candidates the same fixed acceptance and resource limits.
Use implementer for bounded code, reasoner for difficult tradeoffs, reviewer for inspection, challenger for failure
search and writer for explanation. Capability defaults must earn their mapping through task evidence rather than
model reputation. Reuse one model when alternatives are unavailable and report that limit.

## Dispatch and integrate

Honor modelBudgets: maxCandidates, maxReviewers and maxParallel. Check host and user limits before starting.
maxTokens is advisory unless the host enforces it; state this and stop scheduling when observed usage approaches
that budget. Unknown usage is not zero. Start with one verifiable slice; expand when uncertainty, impact and available
resources justify it. Do not dispatch unsolicited work beyond host authority.

Candidates own separate scratch artifacts/checkouts. Parallel implementers own disjoint files and must not revert
others. Shared-path alternatives need isolation, then one coordinator integrates. Capture patch identity, commands,
observed checks and remaining findings. Compare against a rubric fixed before generation: contract correctness,
failure behavior, measured workload, operating burden and change size. Select a coherent solution; grafting strengths
creates a new artifact requiring fresh verification.

Adversarial checks use safe fixtures, partial failures, concurrent interleavings and denied access. A review verdict
is claimed evidence until backed by reproducible observations. Cancel redundant workers where supported, collect
handoffs and record unfinished effects. A timed-out worker consumes budget and can leave effects; retries cost more.

## Measure benefit

Compare single-model and configured-role runs on identical isolated fixtures with the same acceptance, timeout and
tools. Record defects, hidden acceptance, regression rate, time to verified slice and observed token/cost totals.
Blind evaluation to arm and model identity. Repeat paired runs; publish uncertainty and access failures. Do not
attribute gains to model choice when tools, prompts or checks changed. No quality gain is assumed here.
