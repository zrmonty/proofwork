# Dependency and delivery integrity

Use when dependencies, build execution, artifact origins or CI trust change, or as a relevant lens of a requested security/release audit. Do not run every scanner for a typo.

## Follow what actually executes

Inventory direct and resolved dependencies, lockfiles, vendored/native code, plugins, install/build scripts, container bases, downloaded tools and CI actions for the chosen production artifact. Name runtime versus build-only inclusion and who can alter each input. Build tooling may read credentials even when it never ships to users.

Check resolution sources, pinned versions/digests and integrity validation through existing package/registry mechanisms. Verify the lock is consumed by the actual production build, not regenerated silently. Unexpected registry substitutions, mutable tags, unverified downloads or lifecycle scripts are findings to investigate with their concrete execution privileges; pinning alone does not establish a trustworthy publisher.

Produce a release-input record: source revision; lockfile digest; resolved package/version and transitive path;
registry/origin and integrity evidence; install/build command and toolchain; base-image digest when applicable;
delivered artifact digest; observed inclusion as runtime, build-only or absent. Inspect the artifact's package
metadata, bundled modules, native binaries or image inventory with incumbent tools. Lock entries are candidates,
not proof every dependency ships. A stripped bundle or remote rebuild needs its own observation; record an
unavailable mapping instead of asserting source-to-artifact parity. Investigate lock changes during the build.

For CI, inspect PR/fork trust, event semantics, checkout credentials, token permissions, cache/artifact sharing and which steps receive secrets. Untrusted contribution code must not gain release credentials merely by running tests. Use maintained official workflows and narrowly scoped permissions. Separate verification from privileged publication where the project supports it. Do not weaken branch or organization policy to make checks pass.

## Evaluate current advisories

Consult current authoritative advisories against resolved versions, affected features, target platform and reachable use. Record source/date, affected dependency path, exploit prerequisites, runtime/build exposure and proposed disposition. A scanner database age or unreachable service is a check gap, not zero vulnerabilities. Keep private package metadata inside authorized systems.

A declared advisory severity does not by itself establish application exploitability. Reproduce safely or trace the reachable boundary without fetching malicious proof-of-concept packages. Retain a known vulnerability as unresolved or explicitly mitigated only with evidence and an accountable owner; do not suppress it for a clean dashboard.

Tie each material finding to that release-input record and the actual affected entry point, privilege or shipped
component. Assign remediation ownership and the gate it blocks. A build-only dependency with release-token access
can be more consequential than an unreachable runtime package. Record advisory database freshness and coverage.

## Remediate and prove consumption

Prefer the smallest maintained version or removal that closes the relevant exposure while preserving supported APIs. Check transitive constraints, native ABI, feature flags, licenses and migration requirements. Do not blanket-upgrade the stack to obscure one finding. Rebuild from the updated lock in a clean environment when available, then test the consumed artifact's affected behavior and legitimate path.

Record source, lock and delivery artifact identities. Where existing tooling supplies signatures/provenance or an SBOM, verify them against the intended publisher/build and inspect their scope. An unsigned artifact is a documented provenance gap, not automatic permission to build a new signing service. A dependency inventory is not an exhaustive security audit.

Return findings and dispositions, commands and observed consumed versions, missing access, update ownership and rollback/repair limits. Consult [release gates](../../production-finish/references/readiness-gates.md) for environment readiness; no scan grants deployment authority.
