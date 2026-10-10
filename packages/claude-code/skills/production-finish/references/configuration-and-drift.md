# Configuration and environment drift

Use for release configuration, environment differences or unexpected behavior after promotion. Inspect the actual delivery path rather than collecting a copy of every environment variable. Values and private account names stay outside reports.

## Establish the contract

List required keys by name, owning consumer, source, type/range, secret classification and safe default. Separate browser-visible configuration from server credentials. Trace build-time substitution, startup validation and runtime lookup; a runtime change cannot repair a secret already embedded in public output. Fail startup before listening when a required safety or persistence setting is invalid. Avoid silently falling back to development credentials or ephemeral storage.

Unknown optional settings need documented behavior; unknown required settings remain a readiness gap. Validate at the boundary once, then pass a typed configuration to consumers. Preserve caller-owned data. Do not print raw environment dictionaries to diagnose differences.

## Compare effective environments

Compare a redacted manifest of configuration names, validation outcomes and non-sensitive operational settings for local, staging and intended live execution. Include artifact digest, runtime/OS/CPU, dependency lock, feature flags, schema version, proxy/TLS termination, identity permissions, durable paths, locale/timezone and scheduler ownership where they affect behavior. Equal source revisions do not establish equal artifacts or effective configuration.

For each difference, state intended, unintended or unresolved; identify the owning code/configuration and its practical effect. Check provider-injected defaults and inherited process settings. A private value can be represented by present/absent and validation result; don't export a hash of a guessable credential. Inspect secret references and access rights through protected provider mechanisms when authorized.

Write a parity table with dimension, local/staging/live observation, classification, behavioral consequence,
required check and owner. Expected differences such as test payment endpoints need evidence that they exercise
the relevant contract; identical names do not prove equivalent privileges or behavior. Unknown live settings
remain unknown. Confirm which image/build is running and where effective configuration was observed, not merely
which environment file was supplied. Never export private URLs, account names or secret-reference identifiers.

Bind the manifest to the artifact and configuration revision. Recheck affected dimensions after a rebuild,
flag/identity change, schema migration or provider-default change. Prefer an existing startup validator and a
small read-only comparison command or deployment check; make output safe before capture. A previous staging pass
does not transfer to a changed artifact. Document intentional drift and the observable condition that invalidates it.

## Exercise drift failures

Use isolated configurations to omit a required setting, supply an invalid value, change a feature flag and deny a needed capability. Observe the real startup/operation error, cleanup and redacted diagnostics. Test a representative schema/configuration mismatch and an old/new rollout pairing when overlap exists. An environment file parsed successfully is not proof its values reached the running artifact.

Generate only the template/check appropriate to existing tooling. Templates contain placeholder names and safe examples, never working secrets. Bind configuration validation and drift checks to the normal build/start/release path when the project supports it; avoid introducing a configuration service for a small application.

Return safe manifest location, artifact/environment identities, tested differences, pending host facts and operator action. Keep live configuration changes, rotations and feature activation within their explicit authority.
