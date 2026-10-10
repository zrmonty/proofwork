# Observability with the change

Use when changed behavior affects serving, durable work, dependency interaction or recovery. Generate the
minimum useful instrumentation alongside that behavior, using the project's logging, metrics and alert tools.
A monitoring proposal alone does not establish an observable release. Avoid introducing a telemetry platform
or mandatory dashboards for a static page or trivial edit.

## Derive signals from the failure map

For each consequential failure, name the decision the operator needs to make and the signal that distinguishes
it. Trace the real request/job/effect boundary. Record signal name, owning code location, safe fields or labels,
unit, collection destination, retention and operator. Use a short signal table linked to the recovery note.

- Logs: operation category, outcome, safe correlation ID, error classification, duration and retry attempt when
  needed. Distinguish rejected, failed and unknown durable outcomes. Preserve causal error context without raw
  payloads, credentials, full query strings or personal records. Log once at the responsible effect boundary.
- Metrics: count accepted/succeeded/failed work and dependency outcomes; measure end-to-end latency and saturation;
  for queues, observe oldest pending age, backlog and durable progress. Define denominator, units and buckets.
  Completed work alone hides stuck jobs; average latency hides the slow tail. Reuse existing conventions.
- Alerts: tie a sustained user-impacting symptom or recovery deadline to an owner and runbook. Define threshold,
  evaluation window, missing-data behavior, routing, escalation and recovery/clear condition. Thresholds come
  from requirements and baseline measurements; mark a proposed value provisional rather than inventing an SLO.

Request, user, tenant and operation IDs may be useful protected log fields; never use them as unbounded metric
labels. Avoid arbitrary exception text, URLs or payload values as labels. Set sampling and cardinality bounds;
document what sampling can miss. Check whether tracing propagates safely across the actual job/dependency
boundary before claiming a joined trace. Choose necessary IDs without adding tracing infrastructure by default.

## Implement and exercise

Add or update actual logger calls, counters/histograms, alert configuration or existing dashboard queries with
the implementation. Keep domain decisions independent of telemetry; exporters must not turn a valid request
into a failure or an unbounded queue. Bound flush/shutdown and verify incumbent behavior when collection fails.
Respect established project conventions and caller ownership.

Exercise one successful path and selected failure/retry paths. Confirm emitted fields, metric increments and
units, safe correlation and redaction. Check the configured collector/query sees the event. Rehearse an alert
with a test route or sandbox recipient when authorized; real paging and messages need existing authority.
Record emitted, collected, queryable and notification-delivered evidence separately. Missing collector access
or delivery authority remains a named gap, not a passed alert. Never fabricate a recipient or page live on-call
staff merely to finish a test.

Check diagnostic overhead with representative traffic if instrumentation is on a hot path. Preserve normal
logging levels, rate limits and secrets policy. Include signal source/config pointers and rerunnable checks in
the release handoff; update them when recovery steps or failure semantics change.
