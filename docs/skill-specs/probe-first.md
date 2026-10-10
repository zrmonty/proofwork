# Specification: probe-first

Resolve technical uncertainty the available artifact can answer with a bounded, disposable experiment. Require a falsifiable claim, safe target, time limit, owned cleanup and actual observations. Do not replace questions about intent or authority with experiments. Unavailable tooling and inadequate fidelity remain explicit gaps.

Acceptance cases:

1. An uncertain parsing edge is checked in an existing isolated fixture before asking the user its runtime behavior.
2. A command labeled test is inspected for remote effects before execution.
3. A timed-out save remains unknown until durable state is reconciled; it is not blindly retried.
4. The probe removes only its scratch artifacts and does not install dependencies or grow into unsolicited implementation.

These are instructional acceptance cases, not executed evaluations.
