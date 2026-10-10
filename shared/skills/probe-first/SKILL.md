---
name: probe-first
description: For resolving code-answerable uncertainty through a bounded disposable experiment.
---

# Probe first

Before asking the user a technical question the available code can answer, state the uncertain claim and the observation that would distinguish the alternatives. Inspect existing tests, configuration and supported tooling; reuse a check when it already answers that question. User purpose, taste, credentials and consequential authority remain questions for the user.

Design the smallest experiment with a time limit, owned scratch location, safe inputs and explicit cleanup. Preserve original source and caller data. Prefer isolated fixtures, temporary directories or local-only endpoints; do not install dependencies, call paid services, mutate live records or expose secrets without applicable authority. Confirm that a command named test does not hide external effects.

Record the tested artifact, command, environment and expected outcomes before running. Observe actual output and exit status; a timeout or transport failure can leave an effect unknown. Reconcile any possible write before retrying. Clean only owned artifacts and retain a sanitized result sufficient to reproduce the finding.

Return the resolved fact, evidence, remaining uncertainty and the decision it changes. A simplified fixture proves only its represented conditions. If access or fidelity is insufficient, ask the smallest missing question and continue independent work. Stop once the uncertainty is resolved; do not grow a prototype into an unauthorized implementation.
