# Hosting and containers

Read this reference when selecting a deployment shape, checking stateful operation, or building a Docker deliverable. Choose from actual requirements, then verify the artifact in that shape.

## Choose an operating model

Ask who will maintain the app and where it will run. Clarify constraints that alter the choice: long-running jobs, WebSockets, writable storage, request duration, burst traffic, geographical requirements, existing accounts and acceptable monthly cost. Verify current platform capabilities and prices from its official documentation before making a specific recommendation.

| Shape | Fits when | Resolve before calling it ready |
| --- | --- | --- |
| Static hosting | Output is static; privileged operations live elsewhere or are unnecessary | Public output inspection, fallback/routing behavior, domain/TLS and any external access policies |
| Managed application service | The runtime and job model fit; managed operations reduce work | Build/start configuration, secret injection, persistence, restart behavior and platform limits |
| Serverless functions | Request/job duration and connection model fit the platform | External durable state, limits, cold starts where material, background execution and retries |
| A single server | Simple stateful operation fits and an owner can maintain the host | Updates, firewall/TLS, service supervision, backups/restore and replacement procedure |
| Container-consuming platform | A portable packaged runtime is useful or required | Image execution, runtime configuration, storage, shutdown, health and network policy |

These are decision prompts, not fixed rankings. An existing adequate platform usually wins over a migration. A hundred registered users tells little about bursts, writes, stored data or reliability. Record the concrete reason for each extra service and leave unsupported future needs out of the deployment.

## Keep durable state out of disposable runtime storage

List the actual persistent state: database, uploads, queues, session data or job progress. Decide which component owns each value, where it is stored, and how replacement instances find it. Check the selected host's storage guarantees. Do not put the only copy on an ephemeral application filesystem.

SQLite can fit a modest application served by one appropriately configured owner of a durable database file. Check real write contention, database access paths, backup requirements and the host's storage behavior. Do not let multiple independent replicas each create their own authoritative file, and do not assume a shared network mount solves coordination. If deployment requires distributed writers, assess a supported coordination/storage model or a server database on those requirements.

A restore test uses a separate isolated destination and a representative backup. Do not overwrite a live database to prove restoration. Check compatible migrations, integrity and a representative application query. Explain how a release can recover from a failed migration or image rollout; a previous image alone does not reverse a destructive schema change. For jobs and writes, verify shutdown stops accepting new work and handles in-flight effects within the platform's termination window.

## Plan the release transition

Describe the actual sequence only when a stateful or rolling release needs it: compatible configuration, schema preparation, application switch, health observation, and later removal of obsolete fields or behavior. Existing deployment mechanisms take precedence over introducing a release framework. For a single-instance app, an agreed maintenance window can be simpler and safer than creating zero-downtime machinery.

Test representative compatibility in an isolated environment: the old app against prepared state, the new app against migrated state, and mixed versions when the host can run both. Include jobs or clients that outlive the deployment. A renamed field or changed message format can break an old worker even when the new HTTP process is healthy.

Separate recovery actions. Reverting application code may be safe before an incompatible data change; after that change, recovery can require a compatible forward fix or an approved restore with known data loss. Backups do not make every migration reversible. Identify the cutover condition, observable stop condition and responsible operator. Do not invent rollback SQL, run a live restore, or replay writes without authority and a demonstrated data model.

Readiness means the instance can serve its required workload, not merely that its process exists. Use meaningful bounded checks and the platform's existing lifecycle behavior; avoid a probe that mutates user data or reveals internal details. Decide which downstream failure should block startup, block routing, or be handled by a degraded feature rather than making every dependency a global outage.

Retain provenance through promotion: tested artifact identity, runtime configuration shape without values, compatible data state, and live observation when authorized. If the destination rebuilds source, inspect its resulting artifact and required checks; a local image's evidence cannot certify an unobserved remote build.

## Build only the image the app needs

Inspect existing Dockerfiles, build scripts and deployment configuration before adding new ones. Derive the image from the real production entrypoint and locked dependency installation. Use a maintained suitable base and record its resolved identity; a pinned digest aids repeatability but needs an update process. Use separate build and runtime stages when build tools or development dependencies are otherwise left in the runtime. Select a compatible base instead of chasing minimum image size at the expense of required libraries.

Limit the build context and copied paths. Make `.dockerignore` exclude credentials, `.env` files, local database files, backups, Git metadata and unrelated output as appropriate. Inspect existing negations and Dockerfile-specific ignore rules so an apparent exclusion really applies. Copy only required runtime output. Keep required config examples safe and schematic. Run with an unprivileged identity unless the app has a documented requirement; ensure intended writable paths still work. Handle signals and termination through the real process entrypoint.

Build credentials use temporary secret mounts when required. Do not put secrets in Dockerfile `ARG`, `ENV`, copy instructions, or command-line text. Runtime secrets are supplied through the chosen platform's protected configuration or mounted files. A build secret mount prevents routine inclusion but cannot protect a script that writes the secret into output; inspect that data path too. These decisions follow Docker's [build guidance](https://docs.docker.com/build/building/best-practices/) and [build-secret guidance](https://docs.docker.com/build/building/secrets/); consult current instructions for the actual builder and platform.

## Prove the image runs

When authorized and Docker is available, build the final image and record its ID plus relevant source/build identities. Capture logs safely: build and runtime commands can emit secrets, so do not publish unreviewed output. Inspect configuration and layers through local tools with redaction before returning results. A current filesystem check alone can miss secrets copied and deleted in earlier layers.

Start the built image with a unique run-owned container name, minimal test permissions, local-only port binding where appropriate, and isolated test data. Do not pass real credentials as command-line literals. Supply necessary test configuration through an appropriate protected mechanism. Exercise readiness and one representative application flow, verify shutdown, and inspect persistence across a replacement when that is a required claim. Use the host's health mechanism when it provides one; avoid adding a dependency solely to satisfy a ritual Docker healthcheck.

Stop and remove only this run's container and owned temporary artifacts, including on failure. Do not prune shared images, volumes or builders. An image build without execution supports packaging only; an unavailable daemon leaves runtime behavior unverified. Do not push an image, deploy it, change domains or expose ports publicly without authorization for that effect.

Containers make deployment repeatable; replicas add coordination obligations. Before recommending more replicas, identify what remains shared, how sessions and jobs coordinate, how writes persist, and which measured bottleneck another instance would relieve. Do not add a load balancer, clustered database or orchestration platform solely because an image exists.
