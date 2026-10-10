---
name: production-finish
description: Prepare an application for production by checking public exposure, choosing hosting with the user, fixing release issues, and building and testing a container when deployment needs justify it.
---

# Production finish

Turn a working application into a release someone can operate. The finish line is a verified production artifact, a suitable hosting plan, and clear remaining responsibilities. A successful development server is only a starting point.

## Establish the destination

Read project instructions, the architecture decision, build and start commands, lockfiles, deployment configuration, persistence, and the primary user flow. Preserve intentional product behavior and other people's work. Identify what this finish request authorizes: local cleanup, packaging, environment configuration, or an actual deployment. Building an image does not authorize uploading it or changing a live service.

Ask early how the user intends to host the app unless that decision is already supplied. Bundle the material unknowns: preferred platform or constraints; budget and maintenance owner; expected traffic and concurrent writes; persistent data or background jobs; domain and external services. Ask only what affects the decision. Continue independent inspection and local fixes while the answer is pending. A missing hosting answer leaves host-dependent readiness incomplete; it need not stop a public-bundle check.

Recommend the least demanding deployment that meets the requirements. A static site may need only static hosting. A conventional web app may suit a managed application service. A single server can suit a small stateful app when someone owns updates and backups. Serverless execution requires a compatible request lifecycle and persistence strategy. Respect an existing suitable choice; compare a realistic alternative when a constraint makes it unsuitable.

Read [hosting and containers](references/hosting-and-containers.md) for deployment decisions, stateful applications, or a requested Docker build. Recommend Docker for a concrete need such as a portable runtime or a platform that consumes images. Do not equate container packaging with scalability or add orchestration for hypothetical growth.

## Check what will actually be public

Trace configuration from source through the production build to its delivery surface. Inspect relevant server and client code, environment-variable substitutions, static/public assets, browser bundles, source maps, error responses, debug routes, and logging. Include the release artifact, not just tracked source. A server variable can become public when a build injects it into JavaScript. A file excluded by Git can still enter a build context or image.

Use local scanners whose output is redacted before it reaches tool results, transcripts, evidence, or shared logs. Record the affected surface, safe file location, detection rule and disposition; never print a credential, a fragment, or the matching source line. Avoid broad commands that display environment values or dump secret-bearing files. Keep any unavoidable raw scanner output private and temporary, then remove only the artifacts this run owns.

Classify a suspected key by its capability and authoritative provider policy. Some identifiers are intentionally browser-public; their associated access rules and allowed origins still need inspection. A variable name, prefix, or scanner finding alone cannot establish secrecy or safety. If classification requires unavailable provider context, record uncertainty rather than publishing the value or inventing a verdict.

Read [exposure checks and response](references/exposure-and-response.md) when scanning sensitive surfaces or handling a suspected leak. Remove actual secret capabilities from public delivery and rebuild affected artifacts. A previously exposed credential remains compromised after deleting its source. Revoke or rotate it only through authorized account operations; otherwise leave that response explicitly pending. Preserve published history unless history changes are separately authorized.

## Make production behavior deliberate

Run the real production build and start path using the project's locked dependencies and intended runtime. Check the primary flow against that artifact. Replace production fallbacks that hide missing required configuration with safe startup failures; keep useful errors while removing secrets and internal details from public responses. Remove unused debug or development delivery paths only after checking their consumers. Preserve monitoring and diagnostic context through redaction rather than silencing every error.

Check the requirements that this application actually has: authorization on protected operations; cookie and proxy settings for the chosen topology; intended TLS termination and network exposure; narrowly scoped service identities; graceful shutdown and cancellation; health and readiness; and limits that prevent obvious resource exhaustion. Use the framework's existing mechanisms. Do not invent a universal hardening layer or change authentication semantics as incidental cleanup.

For persisted data, identify where it survives a restart and a replacement deployment. Verify migrations against the intended release process and test a representative backup restore in an isolated destination. State acceptable data loss and recovery time. A persistent volume without a restore procedure is not a recovery plan. Do not run destructive migrations, delete production data, or modify retention merely because a finishing checklist mentions them.

If containers fit and building is within scope, create or improve the smallest suitable image, build it, inspect its relevant exposure surfaces, and smoke-test the actual image. Report an unavailable daemon or denied build as missing execution evidence, not a passing Docker deliverable. Re-run checks affected by cleanup on the combined artifact.

## Return a release decision

Give the user a concise readiness report: selected hosting and reasons; changes made; production artifact identity; checks actually executed and their environment; findings resolved; and any missing credentials, hosting answers, restore tests, or external actions. Distinguish locally verified packaging from deployment and live verification.

Call the scoped finish complete only when its required checks pass on the final artifact and every material exposure or operational issue has an accountable disposition. An unresolved exposed secret capability blocks release readiness even if local cleanup passes. State scanner coverage and limitations; a clean scan supports a bounded observation, never an exhaustive guarantee that no secret exists.
