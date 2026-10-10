# Architecture and production finishing verification

Date: 2026-10-10. Package version: 0.3.0.

## Delivered behavior

Two original skills, architecture-fit and production-finish, each include an entrypoint, two conditional references and an authoring specification. Architecture selection considers workload, hosting, durability, recovery and operating ownership rather than tool popularity or a user-count threshold. Production finishing establishes hosting, traces public exposure through the release artifact, verifies relevant operation, and builds and exercises a container when it fits the authorized deliverable.

The root router selects these skills for relevant intent. Review found and reproduced two routing defects: ordinary database-choice questions were missed, and finishing unit tests for an app triggered production finishing. Regression assertions failed before correction and passed afterward. An independent follow-up review confirmed both fixes and found no further material issues in the reviewed scope.

## Structural and installation checks

- All 15 automated tests passed, including routing, build boundaries, commit-message structure, checkpoint ownership and completion evidence.
- Both packages built with 14 skills and validated their local references. All 14 canonical skills passed the Codex quick validator.
- Claude Code strict plugin validation passed. Its informational installation-line advice remains non-blocking; repository installation instructions are in README.md.
- Codex installed and enabled proofwork@proofwork-local version 0.3.0. Installed router and new entrypoint hashes matched the built package.
- A scoped scan found none of the previously excluded external-plugin names in current source, documentation or generated packages. This check does not rewrite published history.

## Independent forward decisions

The evaluator received the skills and realistic constraints without an intended recommendation. For a 100-member club with mostly reads, occasional RSVP writes, one VM with durable local disk, owned backups and no high-availability requirement, it recommended a modular application with SQLite, conditional on relevant contention and restore checks. It asked about peak writes, background jobs, booking invariants and recovery targets. The member count did not become a capacity guarantee.

For a 100-staff dispatch app with separately deployed instances, continuous overlapping writes, ephemeral instance disks and required shared durable transactions, it recommended a client/server relational database, with managed PostgreSQL a candidate and an adequate incumbent preserved. It identified shared-state and durability failures in independent local SQLite files. It did not add microservices, a broker or orchestration solely because there were multiple instances.

For a hypothetical finish request with unknown hosting, it proposed focused hosting and operating questions while continuing independent inspection of production inputs, public artifacts and configuration delivery. Hosting-dependent readiness remained provisional. These are reasoned scenario evaluations, not executed database load or restore tests.

## Executed Docker fixture

The evaluator created an isolated static-site fixture under an ignored run directory. Its owner had already selected an existing Linux VM using Docker and authorized local packaging and execution. Docker reported a Linux daemon. An initial Alpine image failed because its BusyBox lacked the httpd applet; the owned failed attempt was cleaned up. A suitable official BusyBox image then passed the complete run.

Final image: sha256:a43273dd49321077f20f506793b2105447621e0f70ea95b8a76041c776aab6bb, 6,780,653 bytes. Base: busybox@sha256:bdf57e528e45e4433820e045b29b4597825a1c9e38353532d90a01445013f82e. Source identity: b64f28dd280dfc8fffd6b7404ad581f4b7cbe45c282b98fb920e27e0093b8bd3.

- A deny-all Docker context included only the Dockerfile and static page; the image explicitly copied the page.
- A synthetic credential sentinel supplied a positive scan control. Image configuration, full history, exported members and every file in two layer archives were checked locally for that sentinel and unintended .env inclusion. Values and matching source lines were withheld from reported output.
- The exact image ran with UID 65534, a read-only filesystem, dropped capabilities, no-new-privileges, bounded resources and a dynamically assigned localhost-only port.
- HTTP returned 200 with the expected page. Requests for .env, Dockerfile and check.py returned 404. Runtime UID and stopped-process state were checked.
- Only the owned container, image tag, export archive and synthetic credential file were removed. Cleanup absence was verified; shared base images and build cache were preserved. There was no registry push or live deployment.

Local command evidence and the self-check remain in the ignored fixture directory. This sanitized report is the published evidence. Container execution supports portable static-site packaging; it makes no claim about horizontal scaling, persistent application data or production availability.

## Limits

These checks do not establish exhaustive credential absence, comparative quality gains, real application capacity, backup restoration, TLS/domain behavior, provider credential rotation, vulnerability scanning or live production readiness. Instructions for those requirements are authored and reviewed; execution evidence must come from the actual application's scoped finish run. The earlier host certification limits still apply.
