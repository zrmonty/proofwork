# Proofwork implementation plan

> For agentic workers: use subagent-driven development with explicit file ownership. Read the specification first. All instructional text is newly authored.

Goal: deliver installable Proofwork packages for Codex and Claude Code with a use-proofwork entry point, shared engineering standards, and goal-compatible team execution.

Architecture: canonical authored Markdown in shared/, platform instructions in adapters/, dependency-free Node utilities for packaging, routing, and local checkpoints. Two distributable packages, no external orchestration daemon.

Tech stack: Markdown, JSON, Node.js built-ins, host-native tools. Spec: ../specs/2026-10-10-proofwork-design.md.

## Global constraints

- Do not copy or adapt any existing skill text. Current pstack skills may guide development only.
- Respect host permissions and explicit user authorization. No external publication.
- Prefer pure functions and explicit state/effect boundaries.
- Do not assert host loading or behavioral validation that has not happened.
- Canonical root skill is use-proofwork. Document host namespace differences honestly.
- Original skills must have purpose, inputs, workflow, outputs, boundaries, and behavioral cases.

## Review focus

- Existing objective is retained when attaching within goal.
- Shared writes and stale worker results cannot establish completion.
- Packaged references stay within the package and resolve.
- Missing models/tools and absent Claude runtime remain explicit limitations.
- Fresh-context workers load discipline without relying on inherited context.

## Task 1: orchestration and review instructions

Owned: shared/skills/{use-proofwork,worker-mode,setup,thermo-nuclear-code-quality-review}, shared/playbooks/, shared/contracts/.
Produces: original root router, assignment/result/evidence contracts, bounded playbooks, reviewer standards. Entry reads adapters/runtime.md and scripts/proofwork.mjs routing command when installed; relative links use ../../contracts and ../../playbooks. Skill names are canonical directory names.

- [ ] Run pressure scenarios without authored skill guidance and save the behavior observed.
- [ ] Author minimal original instructions against the spec and baseline gaps.
- [ ] Run the same scenarios with relevant authored skills and record compliance/gaps.
- [ ] Review relative references and scope with an independent reviewer.

## Task 2: language, principles, and frontend skills

Owned: shared/skills/{typescript-best-practices,rust-best-practices,python-best-practices,functional-programming,data-driven-development,clean-code,frontend-design}, shared/principles/.
Produces: independently authored targeted guidance and language/frontend cases; no dependencies on installed skills. Every skill has a spec/acceptance record in docs/skill-specs/ owned by its author.

- [ ] Define and execute baseline scenarios before authoring.
- [ ] Write compact skill instructions grounded in requirements and official documentation.
- [ ] Run relevant pressure cases with instructions; check clean cases as well as defects.
- [ ] Ensure frontend work includes selected direction, rounded editorial preference, and rendered evidence.

## Task 3: executable tools and platform adapters

Owned: scripts/, tests/, adapters/, package.json, packages/, .gitignore.
Produces: node scripts/proofwork.mjs route --task <text> --files <comma-separated paths>; run-state operations documented by --help; node scripts/build.mjs; npm test. Route result names playbook and skills and makes no external calls. Packaged runtime.md links the actual host workflows. Build validates authored assets and safe paths.

- [ ] Write tests for pure routing, lifecycle/state validation, stale evidence, safe filesystem paths, and package references; observe failures before implementation.
- [ ] Implement minimal Node tools with validation and single coordinator ownership.
- [ ] Run tests and build both host packages; inspect manifests against host docs.
- [ ] Include install/start commands that do not promise unsupported bare slash aliases.

## Task 4: integration, evaluation, and handoff

Owned by coordinator: README.md, docs/verification.md, evals/, LICENSE decision, docs/decisions.md, git history.

- [ ] Integrate all outputs and run package validation and functional tests.
- [ ] Run original authorship/reference audit and independent correctness/thermonuclear review.
- [ ] Exercise available host loading and task behavior in disposable fixtures; report absent host/runtime capabilities explicitly.
- [ ] Fix material findings, rerun affected checks, produce local distributable archives.
- [ ] Commit complete source and verified artifacts; leave no external publication or invented approval requirement.

Host-level acceptance criteria not executable in this environment are reported as unverified release gates, never relabeled as passing. Deliver a usable local prerelease with a tested capability matrix if full dual-host certification is unavailable.
