# Architecture fit

Recommend the least burdensome complete architecture its owners can operate. Challenge whether a database, framework, ORM, cache, broker, API, service or orchestrator is needed before comparing brands. Smaller tools/fewer dependencies are not simpler when they require complex homemade replacements. Recommendations do not authorize installation, migration, deployment or rewriting; focused bug fixes normally preserve the demonstrated stack.

## Establish requirements

Inspect repository, deployment, workflows, ownership and supplied decisions. Separate constraints, preferences and assumptions. For each major component identify behavior, operating/failure burden, simpler arrangement and what fails without it. Apply this to incumbents as well as proposals.

For PostgreSQL, determine why a separate service is needed and which requirement a simpler supported store fails. Investigate shared writes, features, topology and recovery. Neither habit nor a SQLite example settles the decision.

Ask grouped unanswered questions that change fit: overlapping writes/jobs, transaction duration, persistence/replacement, host, acceptable loss/recovery time, budget and owner. Use evidence first; continue independent comparison while awaiting answers. Accounts, sessions and writers differ; invent no per-user capacity cutoff.

Use [language fit](../../language-fit/SKILL.md) when languages/frameworks remain undecided. Architecture decides necessary responsibilities/boundaries; language fit compares their implementation.

## Compare equal obligations

Include incumbent and simplest adequate alternative; add another for a material requirement. No added component is legitimate. Compare development, hosting, updates, migrations, access, backup/restore, incidents and expertise. Managed service can be simpler than smaller self-operated tooling.

Give consequential components explicit dispositions: keep with demonstrated reason, replace with named fit, omit absent requirement, or defer a specific unknown. Unranked catalogs or unchanged popular stacks with vague assurances do not decide.

Compare persistence reads/writes, transactions, features, topology and recovery using [storage fit](storage-fit.md). Simpler arrangements losing durability/coordination are inadequate. Use [component decisions](component-decisions.md) for services, caches, jobs, search and deployments. Modules often suffice until an actual independent boundary earns cost.

Use [exit cost and ownership](exit-cost-and-ownership.md) for provider dependence/portability; compare real export obligations/operators without unused adapters.

## Choose and verify

Build a small decision matrix for consequential choices: requirement, acceptance threshold, incumbent result, simpler candidate result, operational cost and uncertainty. Use project targets for peak simultaneous writes, p95 latency, restore time, monthly cost and maintenance hours; do not invent universal cutoffs. Count migration and custom replacement work. Reject a component whose claimed benefit has no unmet requirement.

For a difficult or costly-to-reverse choice, request an independent challenge only when configured models, host capability, authority and a bounded budget permit it. Give the challenger the same constraints and ask which premise or measurement could overturn the choice. A different model's agreement is not evidence; resolve disputed claims through a representative experiment. If no second model is available, label a separate-role check as single-model.

Walk an action and consequential failure through the simplest complete arrangement. Locate required responsibilities/custom mechanisms and a cheap falsifying observation. Preserve genuine tool mandates and explain constraints. Missing decisive evidence makes recommendations conditional.

For incumbents, compare simplification with migration, compatibility and recovery risk. Affordable, understood PostgreSQL with required shared state may deserve retention; explain why. Avoid moving data merely to remove boxes.

Record scope; facts/assumptions/unknowns; options/incumbent; choice/requirements; tradeoffs/owner; persistence/failure/backup; observed evidence; reopening condition; and smallest plausible migration step in the existing format.

Reopen for missed agreed targets, required writable replicas or absent features, not “when big.” Direct query modules, versioned schemas and explicit transactions provide affordable seams without pretending stores interchangeable. Name SQL, locking, conversion, cutover and rollback changes; packaging does not make replicas safe.

Return chosen fit, reasons, omitted components and operating/verification plan. Separate observations from expectations. Unknown hosting leaves dependent choices provisional; missing representative load leaves capacity unverified. Preserve complete behavior/recovery while subtracting components.
