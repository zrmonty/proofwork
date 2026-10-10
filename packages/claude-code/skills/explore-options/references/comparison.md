# Prototype comparison

Write a common brief: outcome, preserved contracts, hard constraints, workload, checks, deadline and spend ceiling.
Use one baseline and one alternative. Candidates answer the same question. Frontend prototypes compare the actual
primary journey and responsive/error states; backend prototypes compare realistic latency, throughput, failures,
memory and operating burden.

Keep artifacts separate: scratch directories for pure experiments, isolated checkouts for implementation alternatives.
No parallel writes to shared files, databases or remote resources. Define cleanup and effect ownership. Stub unavailable
services honestly; a stub proves its local contract only.

Run identical checks and preserve observations including failures. Tabulate candidate, acceptance, resource usage,
recovery, maintenance burden and uncertainty. Measurements need command, environment, sample size and units.
Reject hard-constraint violations before comparing speed or aesthetics. Never average away correctness failures.

A reasoner can select from blinded candidate labels; a challenger attacks the winning assumption when failure cost
is material. Record a concrete principle that changed the choice. For a tie, prefer the existing or simpler adequate
approach. Ask only when purpose, taste or consequential authority remains missing.

Integrate one bounded slice. A combination is a new artifact: repeat acceptance and regression checks. Delete discarded
experiments and temporary dependencies. Record actual dispatch, duration and available token usage; missing usage
stays unknown. Stop when the decision is resolved, rather than exploring every alternative.
