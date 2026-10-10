# Configure model roles

Setup can write repository-local .proofwork.json when requested. Merge fields; preserve commitFormat and unrelated
settings. Never change global defaults or credentials. Absent modelRoles inherits the session; {} opts into
capability-based selection from an observed inventory.

```json
{
  "modelRoles": {
    "implementer": {"model": "inherit", "reasoning": "inherit"},
    "reasoner": {"model": "inherit", "reasoning": "inherit"},
    "reviewer": {"model": "inherit", "reasoning": "inherit"},
    "challenger": {"model": "inherit", "reasoning": "inherit"},
    "writer": {"model": "inherit", "reasoning": "inherit"}
  },
  "modelBudgets": {"maxCandidates": 2, "maxReviewers": 2, "maxParallel": 3, "maxTokens": null}
}
```

Replace inherit with an observed host model ID where selection is supported. Reasoning accepts inherit, low,
medium or high, bounded by actual host support. Use inherit when session reasoning capability is unknown.
Discover inventory through available host tools or supported CLI. Write only observed entries to a temporary JSON
array: [{"id":"observed-id","strengths":["code"],"reasoning":["medium"],"available":true}]. Strengths
code, reasoning, review and writing express observations or documented capabilities, never universal rankings.

Run `node <plugin-root>/scripts/model-roles.mjs plan --repo <repo> --host codex --inventory <inventory.json>`;
use claude-code for that host. Inspect resolved and capabilityMissing per role. The helper is read-only. Missing IDs
or unsupported reasoning do not fall back. Omitted opted-in roles use capability preferences; reviewers/challengers
prefer relevant alternatives. Missing inventory leaves automatic choices unavailable. Inventory cannot prove dispatch.

Use the runtime adapter for dispatch. Log requested/actual models and effort, unknown otherwise; replan after access
failures. Explicit mappings override capability preferences. Budgets are advisory unless host-enforced; the coordinator
limits scheduling. Setup provides a first useful check, then proceeds. It does not force newcomers to configure roles.

Candidate budgets default to two; maxCandidates can explicitly request three for a distinct arena hypothesis.
maxReviewers remains at most two and maxParallel at most three; a third candidate does not grant extra host capacity.
