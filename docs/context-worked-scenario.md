# Worked context scenario

This is an illustrative procedure, not an executed investigation or defect report.

**Request:** “Why do invoice reminders sometimes arrive twice, and what would changing the retry do?” Assume access to a local checkout and disposable fixtures; assume no authority to send messages or alter production jobs.

Use [trace-path](../shared/skills/trace-path/SKILL.md) to locate the reminder entrypoint, queue registration, worker, provider call and durable completion record. Return pointers to actual symbols and identify who owns attempt state. Follow timeout and cancellation as well as success. If the provider contract is unavailable, record that boundary as unresolved rather than assuming a timeout prevented delivery.

Use [origin-check](../shared/skills/origin-check/SKILL.md) to examine the retry introduction and related tests or decision records. A commit documenting transient transport failures supports that historical intent; it does not prove duplicate delivery is impossible. If no rationale survives, report the current behavior and competing explanations separately.

Use [impact-map](../shared/skills/impact-map/SKILL.md) before proposing a retry change. Find other jobs sharing the helper, preserved final-error identity, attempt-count contracts, queued old-version work and provider operation identifiers. Associate each material dependency with a representative check. A no-hit search leaves dynamic consumers uncertain.

Use [probe-first](../shared/skills/probe-first/SKILL.md) to test the suspected seam locally: a disposable fake provider records successful delivery, then returns a timeout before the worker records completion. Bound the experiment's duration and attempt count, preserve the original implementation and inspect whether retry produces a second delivery. No real messages or credentials are required. This fixture demonstrates only its modeled interleaving; it does not establish the actual provider's behavior.

Expected artifacts are a concise flow map, historical evidence/hypotheses, a prioritized consumer/check map and a reproducible sanitized probe result. If the probe supports a defect, the next step is an authorized bounded fix with regression checks, not an automatic production retry or deployment. If it does not, report that result and the next observation needed; do not force the hypothesis to fit.
