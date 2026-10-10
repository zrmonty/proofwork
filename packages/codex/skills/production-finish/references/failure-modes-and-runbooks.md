# Failure modes and code-linked runbooks

Use for consequential release changes or recovery responsibilities. Scope to actual data, jobs and user journeys. Prefer a short executable recovery procedure to a speculative catalog of outages.

## Map the failure

Walk a critical request/job through its real effects. For each consequential boundary record: failure trigger; completed and uncertain effects; durable owner; user-visible symptom; detecting signal; safe retry/reconciliation; recovery action; verification; operator. Include dependency outage, process termination, resource exhaustion and incompatible configuration/schema only where they can occur in this system.

Separate degraded capability from unsafe operation. Decide what must stop accepting work and what may continue. A healthy process may have unavailable persistence. A liveness probe must not restart a service merely because an upstream provider is slow; readiness should reflect required serving capability. Probe design follows the actual host contract.

Rehearse selected faults with synthetic records and local/staging resources. Bound test duration, request count and storage use. Do not kill shared services, send payments/messages or alter live data for a drill without authority. Observe cleanup, in-flight work, retry amplification, duplicate effects and recovery after the fault ends. Missing fault access remains unverified.

## Connect symptoms to evidence

Reuse incumbent logs and metrics. Identify safe request/job IDs, errors, latency, queue age, saturation and durable progress that distinguish failure causes. Redact before output; avoid credentials, raw personal records and unbounded cardinality. An alert needs an actionable symptom, detection window, owner and recovery link. Record whether signal collection and alert delivery were actually exercised. Instrumentation added to source does not prove an operator receives alerts.

## Write the runbook beside the code

Create or update the project's existing operations document. Each procedure names the affected artifact/version, entry point and configuration/schema owner with file pointers. Include:

- Symptom and safe diagnostic commands; expected outputs and stop conditions.
- Preconditions, required access and irreversible effects; named owning role.
- Recovery steps in order, with timeout and verification after each material effect.
- Unknown-effect reconciliation before retry, including operation IDs and durable records.
- Code rollback versus data/schema forward repair or separately authorized restore.
- Recovery verification: a representative read/write or job journey and data-integrity check.
- Escalation when the procedure fails; evidence gaps and last rehearsal environment/date.

Derive commands from actual build/start/migration/backup tools and inspect them. Test against disposable destinations. Never publish an invented rollback command or paste a destructive restore as an unconditional next step. Mark commands requiring environment-specific substitution and validate those substitutions before use. A successful image rollback cannot undo migrated or deleted data.

A backup claim requires an isolated restore with application reads and integrity checks. Record observed restore duration and latest recoverable point against agreed recovery time/loss. If these targets are unknown, give measured facts and keep adequacy provisional. Recheck runbooks when commands, schemas, configuration or effect ordering change.

Return the operational change and what became easier to diagnose or recover, with observed evidence. A written runbook is locally documented; an executed drill is rehearsed in its environment. Neither establishes verified live recovery.
