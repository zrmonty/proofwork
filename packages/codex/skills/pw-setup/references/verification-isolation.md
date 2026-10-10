# Verification prerequisites and isolation

Read when project commands can touch external services, fixtures require special state or a successful check depends on hidden local inputs. Capability discovery should establish a usable evidence path without silently provisioning a new environment.

## Inspect the command's actual reach

Follow the selected script through its wrappers, environment selection and setup/teardown. A test task can seed a shared database, upload artifacts or invoke a deployment hook. A harmless command name supplies no authority for those effects.

Identify the concrete prerequisites: tool/runtime version, dependency lock, required environment names without values, supported local service or fixture, writable output and discovered source target. Keep discovery task-specific. Do not inspect unrelated credentials or provision a browser for a pure parser change.

Classify a failure from its observed mechanism. A rejected option differs from a missing binary; connection refusal differs from an application assertion; a strict type failure differs from unavailable typing tooling. Choose the next step that addresses that cause rather than repeating the same failed probe or weakening the criterion.

## Example: tests use a shared database

The project's default integration command reads the ordinary application connection setting and performs destructive fixture reset. Before running it, establish that the selected destination is isolated and owned by this run. Inspect safe destination metadata without displaying credentials. A variable named test does not prove the target is disposable.

If an existing isolated fixture is available within scope, use it through the project's supported configuration. Otherwise run useful pure and static checks and retain integration as unverified. Do not silently point a reset at the developer's ordinary data, create a paid remote service or substitute a mock while claiming the real integration passed.

Record the prerequisite's accountable next action. Missing a local service is not a request to migrate storage or replace the project's stack. Installation or global settings changes need their applicable authority; a setup invocation alone does not grant it.

## Own the verification lifecycle

Know which files, temporary records, processes, ports or containers the check creates. Prefer existing ownership markers and unique run destinations. Cleanup only those resources; never prune all containers, kill every process on a common port or remove unrelated output directories.

A background process that survives the check can contaminate a later result. Observe termination through the supported host path. An unconfirmed stop is an outstanding effect, not clean teardown. Cancellation of a parent command may leave a child or remote job running.

Keep fixtures representative of the criterion while bounded in size and cost. A synthetic service can prove local adapter behavior, but not a provider's consistency, permissions or recovery semantics. State that difference in the check plan before promising completion.

## Separate repeatability from authenticity

A clean checkout helps identify source; it does not establish the dependency, toolchain or service state. Conversely, an unrelated dirty note does not necessarily invalidate a parser check. Record actual dependencies needed to reuse evidence rather than treating cleanliness as a complete proof.

For coverage, inspect collection, independent executable inventory and exit-status enforcement. Unimported files must not disappear from the target. Missing branch measurement remains unverified; do not replace it with line coverage.

Return which path is executable now, its safe isolation and teardown contract, what it can prove and the exact remaining gap. This plan authorizes no goal, scheduler, external publication or environment mutation beyond the user's existing scope.
