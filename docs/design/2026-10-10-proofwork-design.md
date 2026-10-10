# Proofwork engineering team plugin for Codex and Claude Code

Design specification, October 10, 2026. Product name: Proofwork. Root skill: `use-proofwork`. The user authorized autonomous implementation within a goal, using subagents, and supplied github.com/zrmonty/proofwork as the repository. This document specifies the product; host goal activation remains explicit.

## Purpose and finish line

Turn Codex and Claude Code into a coordinated engineering team that ships less, better code through rigorous parallel work and deliberate use of model strengths.

Every worker must carry the engineering discipline. The coordinator owns decomposition, integration, and the final result. Independent review tests assumptions and implementation quality. Completion requires evidence against the user's objective.

The first release supports bug fixes, features, refactoring, investigation, and code review; independent agents running the same mode; coordinated parallel work; and execution within the host's native goal system. Both platform packages share the same standards. Their tools and lifecycle behavior may differ and must be documented honestly.

## User experience

Invoke the mode with an ordinary task. The mode discovers the environment, reads project instructions, scopes the work, chooses a playbook, and proceeds within existing authorization. Workers do not need the user to select individual principles or review skills.

Illustrative usage, to be checked against the packaged skill names at implementation:

```text
Codex: invoke $use-proofwork with "Fix the export truncation and verify the final page."
Claude Code: /proofwork:use-proofwork Fix the export truncation and verify the final page.

Either host's native /goal:
Implement the approved design using use-proofwork. Complete only when its acceptance
criteria have current evidence, integrated checks pass, and material review
findings are resolved. Preserve the stated constraints and checkpoint progress.
```

The plugin does not register a competing `/goal` command. Invoking the mode alone does not create a goal. Explicit goal activation attaches the mode and design reference to the objective so continuation turns recover the same operating contract.

For independently launched agents, each invocation receives the same discipline. Coordination across unrelated chats is not automatic: agents join one run only through an explicit assignment and shared run identity. Otherwise they remain independent.

## Architecture decision

All shipped skills, playbooks, principles, agent instructions, and supporting instructional references must be written originally to this project's specifications. Do not copy, fork, adapt, or mechanically paraphrase existing skill files. Existing projects may inform capability requirements and evaluation ideas; official language and platform documentation grounds technical guidance. The user's existing thermonuclear skill is a requirements reference, not a file to import. Each new skill has an explicit purpose, inputs, workflow, output/evidence contract, boundaries, and behavioral acceptance cases. Track requirement-to-skill coverage instead of upstream file parity.

Use one source repository, a shared set of Markdown skills and playbooks, and two independently installable packages. Platform-specific instructions and manifests adapt host tools. A small build/validation script copies approved shared assets into each package and verifies references. No database, orchestration service, or new background daemon in the first release.

Alternative A was two hand-maintained forks. It makes initial copying easy but allows review standards and fixes to drift. Alternative B was a new universal agent runtime. It would own scheduling, credentials, permissions, and recovery already supplied by the hosts. Shared instructions with narrow adapters provide the required behavior with less code.

Proposed source layout for a dedicated repository:

```text
shared/
  skills/use-proofwork/SKILL.md
  skills/worker-mode/SKILL.md
  skills/thermo-nuclear-code-quality-review/SKILL.md
  skills/setup/SKILL.md
  skills/{typescript-best-practices,rust-best-practices,python-best-practices}/SKILL.md
  skills/{data-driven-development,clean-code}/SKILL.md
  skills/functional-programming/SKILL.md
  skills/commit-features/SKILL.md
  skills/frontend-design/SKILL.md
  principles/
  playbooks/{investigate,bug-fix,feature,refactor,review}.md
  contracts/{assignment,worker-result,run-state,evidence}.md
adapters/{codex,claude-code}/
  runtime.md
  goal.md
  control-cli.md
  control-ui.md
packages/{codex,claude-code}/
scripts/
evals/
LICENSE
NOTICE.md
UPSTREAM.md
```

Paths and build language are design choices to refine during planning. Package manifests and agent definitions must use the actual supported formats, verified by host loading. Shared principles have one canonical source. Workers load the required discipline explicitly rather than relying on inherited chat context.

This design document is saved in the current workspace for review. Implementation should use a dedicated repository; it is a separate product from Document Prep.

## Ownership and contracts

The coordinator is the only writer of aggregate run state and the only actor allowed to conclude that the team completed the objective. Workers write only their assigned code and their own result/evidence files. Reviewers inspect and report by default. Implementation of review findings requires authorization already present in the task or newly supplied by the user.

Assignment contract:

- Run and task identity, role, objective, and acceptance criteria.
- Explicit files/modules owned, allowed checkout, base revision, and dependencies.
- Required principles, verification commands or observed behaviors, and available capabilities.
- Constraints, authorized actions, configured limits, and where to return results.

Worker result contract:

- Ready for review, needs revision, or blocked, with a reason.
- Revision or content identity, changed files, evidence references, unresolved findings, and next action.
- Tests actually executed and material gaps. A worker's summary is not itself verification evidence.

Each evidence record identifies the criterion, exact revision or file digest, environment, command or interaction, observed result, and artifact path. The coordinator checks the artifact and reruns material integration checks. Evidence from an earlier revision is invalidated when relevant behavior or dependencies change.

## Engineering mode and parallel work

The mode routes by task, not by a fixed ceremony. Investigation may remain read-only. A bug fix needs a reproduction and regression check. Features need observable acceptance criteria. Refactoring needs behavior-preservation checks. Reviews need a comparison base and scoped findings.

Every worker inspects relevant callers, tests, contracts, and existing utilities; chooses sound domain structures; preserves trust-boundary validation and error handling; makes the smallest complete change; and verifies the claims it makes.

Parallelize independent work or independent attempts that answer a concrete unresolved question. Do not multiply agents merely to satisfy a team metaphor. Respect host concurrency limits and user constraints. Initial default is at most three workers plus the coordinator, reduced to the host's available capacity. This is a design default, not a required team size.

Disjoint ownership may share a checkout. Overlapping writes, alternative implementations, and shared generated outputs use isolated worktrees/checkouts. Agree on shared contracts before dependent edits. Integrate one accepted change at a time, then verify the combined artifact. Conflicts go to the coordinator; agents do not overwrite each other's work.

No nested delegation by default. The coordinator may authorize bounded nested work when it remains within concurrency, ownership, and cost limits. Worker completion is provisional until integration and review.

## Review and simplification

Author an original thermonuclear review skill as a shared first-class capability. The user's existing skill at `C:/Users/zrmon/.codex/skills/thermo-nuclear-code-quality-review/SKILL.md` informs the requirements below; its text and workflow are not imported or adapted.

Workers apply its standards. An independent reviewer applies the full skill to substantial changes and the integrated team diff. Keep its verdicts: meets the bar, needs restructuring, insufficient evidence. Preserve the presumptive 1,000-line crossing rule, evidence requirements, scope discipline, and behavior-preservation safeguards.

Correctness and maintainability are distinct review responsibilities. Both can be handled by one independent reviewer for a modest change; separate them when complexity warrants it. Security checks follow the changed trust boundaries. A maintainability verdict never substitutes for correctness or security evidence.

Lightweight cleanup is part of implementation. Specify our own simplification workflow from observable quality requirements and behavior-preservation checks. Avoid competing cleanup skills with duplicate rules. The coordinator accepts or rejects each material finding with evidence; accepted fixes receive focused verification and review of the revised changes. After two unsuccessful fixes based on the same premise, investigate that premise before repeating the approach.

## Language skills, data-driven development, and clean code

These are first-release requirements. Setup inventories languages, manifests, toolchain versions, project guidance, and existing check commands. The coordinator selects skills per assignment, and workers and reviewers explicitly load them. Mixed-language changes load each affected language's guidance and check the contracts between them. Do not dump every language manual into every agent's context.

### Functional programming as the default

Author an original functional-programming skill and make its principles part of worker mode and all three language skills. Prefer pure functions, explicit inputs and outputs, and data transformations over mutable object lifecycles, hidden state, or sequences of commands that repeatedly alter shared state. This is the default programming approach, not a requirement to rewrite existing architecture or introduce a functional library. Visual design and evidence-based engineering still iterate; the preference concerns how code represents behavior and change.

Domain calculations, validation rules, decisions, and transformations should be pure when practical: the same inputs produce the same outputs, with no observable mutation or I/O. Supply time, randomness, configuration, and relevant state as inputs rather than reading globals inside domain logic. Compose small functions where composition clarifies the flow; avoid point-free puzzles, unnecessary wrappers, abstraction-heavy combinator chains, and dependency additions solely for functional syntax.

Represent stateful behavior as explicit transitions, for example `transition(state, event) -> nextState + effectsToPerform`, using the language's ordinary types. The transition decides what should happen; a narrow boundary executes the required effects and routes success/failure results back into the model. Use effect descriptions only when they clarify a genuinely stateful workflow; simple I/O needs no invented effect framework. Persist only necessary state, identify its owner, and make ordering, retries, cancellation, and partial failure explicit. Pure modeling does not itself make external actions atomic or safe to retry.

Prefer immutable data at boundaries between functions and agents. Local mutation confined to a function can be appropriate when it improves clarity or measured performance and does not change caller-owned data. Loops and iterators are both valid; choose the clearest correct implementation. Purity is about observable behavior, not replacing every loop with map/reduce. Avoid repeated whole-object copies, unnecessary allocations, or deeply nested transformation chains to satisfy a stylistic preference.

TypeScript guidance favors readonly contracts where useful, discriminated state/event unions, and explicit async/I/O boundaries. Rust guidance uses ownership, borrowing, enum-based transitions, and idiomatic iterators without fighting the borrow checker or banning efficient local mutation. Python guidance favors explicit function arguments, immutable value records where justified, simple comprehensions/iterators, and context-managed effects without pretending shallow immutability prevents nested mutation. Follow existing frameworks' state mechanisms at their boundaries; do not replace established UI state tools as incidental cleanup.

Workers explain material departures from this default in the result when they affect design, performance, or compatibility. Reviewers look for hidden dependencies, mutation of caller-owned inputs, tangled side-effect ordering, and state that can be modeled more directly. Acceptance tests check deterministic outputs, input preservation where promised, transitions and error cases, and the actual behavior of effect boundaries. Functional style does not replace integration checks.

TypeScript skill: author original guidance against our requirements, verified against official TypeScript documentation and project conventions. Cover discriminated unions and exhaustive handling, inference from authoritative schemas, meaningful domain types, validation of external unknown data, truthful narrowing, async failure handling, cleanup of resources, and behavior-level tests. Avoid unjustified casts, optional-field state bags, and generic wrappers. Follow the repository's compiler/lint configuration; do not globally tighten settings as incidental cleanup.

Rust skill: author original guidance against our requirements, grounded in official Rust documentation and project conventions, with focused references loaded by topic. Cover ownership and borrowing, explicit domain enums, recoverable Result-based errors, API boundaries, numeric safety, async cancellation, concurrency/shared state, and justified unsafe code with documented invariants. Use the repository's edition, toolchain, formatter, Clippy policy, and test workflow. Do not ship RTK-specific assumptions in general Rust guidance. Rules suggesting dependencies or optimizations remain conditional; never add a crate or optimize an unmeasured path merely to satisfy a checklist.

Python skill: author a compact shared skill grounded in official Python guidance and repository conventions. Cover type annotations at meaningful interfaces, appropriate dataclasses/enums instead of ambiguous dicts, explicit exceptions and preserved causes, context-managed resources, mutable-default hazards, iterable and mutation semantics, async cancellation, subprocess/serialization boundaries, and behavior-level tests. Reuse configured tools and installed dependencies. Do not mandate a new type checker, framework, packaging system, or lint tool.

Data-driven development has two explicit meanings in this design, subject to user correction. First, model the domain with clear data shapes, states, invariants, ownership, and transformations before adding orchestration. Use declarative data where it removes branching; do not turn simple logic into an unnecessary configuration language. Second, make engineering decisions from evidence: define a hypothesis and success criterion, capture a baseline, run a focused experiment, compare outcomes, and accept/reject the change from the result. Prefer representative, sanitized fixtures. Performance claims require repeatable measurements and end-to-end relevance. Tests must observe behavior rather than duplicate implementation. This does not prescribe data-oriented memory layouts or domain-driven-design ceremonies.

Clean-code skill: one concise index of shared principles with links to their canonical rules. Require cohesive ownership, concrete names, direct control flow, small justified interfaces, explicit state, deletion of dead/duplicate mechanisms, boundary validation, preserved error handling, and testable behavior. Avoid arbitrary function-size rules, automatic class hierarchies, or abstraction quotas. Thermonuclear review is the demanding enforcement pass; do not maintain a second contradictory quality standard.

Precedence: user requirements and host permission rules, then applicable project instructions, then compatible plugin defaults. Where instructions conflict materially, state the conflict and preserve required behavior. Each assignment records selected skills and project checks. Each result reports checks actually run and justified deviations. Skill text guides agents; deterministic repository checks enforce what they can. No claim that instructions alone guarantee compliance.

## Model routing

Roles are coordinator, investigator, implementer, correctness reviewer, and maintainability reviewer. Setup maps roles to models the host actually exposes. Default to the user's current model/settings; explicit configured role mappings select alternatives. Never pin current marketing model names as permanent defaults.

Unavailable configured models are reported before dispatch. Offer a supported fallback when allowed by the user's policy; never silently claim a different model performed the review. Record the requested and actual model when the host provides that information; mark unavailable metadata as unknown.

Native multi-model routing is included where supported. Mixed-provider workers require an explicit external bridge with credentials, process isolation, output validation, cancellation, and usage reporting. They are an extension after the first release, not something native subagent calls can be assumed to supply.

## Frontend design and visual quality

An original frontend-design skill is a first-release requirement. Its purpose is to create beautiful, distinctive, usable interfaces whose visual decisions follow the product, audience, content, and brand. Author our specification, skill, workflow and supporting resources independently. Integrate frontend design with engineering mode, worker assignments, browser evidence, and goal completion; it is also directly invocable for design, critique, and refinement.

Inputs are the requested surface and user task, actual content and states, brand constraints, incumbent components/tokens, target devices, and available assets. Outputs are a concise design brief, a selected visual direction with reasons, a working implementation or scoped critique as requested, reusable project-native tokens/components where justified, and evidence of visual and functional verification. Preserve an established identity during refinement; replace it only within an authorized redesign. Do not invent testimonials, customer counts, claims, or product behavior to make a composition look complete.

Choose visual direction before distributing UI implementation. For new or substantially redesigned surfaces, explore two meaningfully different compositions in lightweight sketches or prototypes and select against the brief. Preserve the user's explicit preferences. If they delegate the choice, the coordinator selects and records its reasons; aesthetic exploration must not become a mandatory approval bottleneck. Small refinements use the existing direction. Record decisions in the project's established design documentation, or a concise DESIGN.md when none exists.

The selected direction specifies content hierarchy, typography and reading rhythm, spacing/density, layout/composition, color and contrast, imagery/icon treatment, and purposeful interaction/motion. Decisions must explain how they serve this surface. A dashboard should make its real tasks efficient; an editorial or marketing surface can express more personality. Distinctiveness does not require unusual controls, illegible type, decorative overload, or novelty at the expense of use.

### Authentic editorial character and softer forms

The user's preferred starting direction is an authentic, inviting editorial experience, with Substack as a reference for publication identity and content-led structure. This is a preference for approachable websites with recognizable human authorship, not a requirement to reproduce Substack's brand or layout. Translate the preference into independently designed surfaces, and adapt it when the task or an established brand calls for a different treatment.

Put real content and the user's next action ahead of decorative scaffolding. Give a publication a recognizable title, voice, author identity, useful metadata, and readable article structure where these are real product requirements. Compose indexes around meaningful headlines, excerpts, images, and reading priorities rather than forcing every item into the same marketing card. Product interfaces should carry the same care through clear labels, useful feedback, and comfortable controls. Authenticity comes from specificity and consistency; fabricated social proof, stock slogans, and simulated personal stories cannot supply it.

Prefer comfortable reading widths, generous but purposeful whitespace, clear headline/body relationships, and a considered type pairing. A serif or expressive headline face with a quiet interface face is one possible direction, not a compulsory template. Use available licensed fonts with suitable fallbacks. Typography must handle actual long titles and mobile text without awkward wrapping or microscopic metadata. Warm neutral backgrounds, dark readable text, restrained accents, and honest imagery are candidate treatments; record the chosen palette against the real brief rather than imposing one palette on every website.

Use a deliberate radius system to make surfaces feel softer and more welcoming. Starting values for exploration are 8–12px for compact controls, 12–20px for content surfaces and media, and 20–28px for prominent panels; these are design suggestions, not universal requirements. Pill shapes suit short chips or selected actions when they remain legible. Keep nested radii coherent, retain visible focus and click targets, and use restrained borders or elevation to clarify grouping. Round meaningful surfaces and controls; leave article text and open layout regions unboxed. More rounded must not become a page of nested capsules or indistinguishable cards.

Establish a recognizable visual signature from the content and purpose: a particular headline treatment, image crop, byline arrangement, section rhythm, or small interaction detail. Prefer one or two coherent decisions carried across the experience over a collection of unrelated effects. Standard navigation and form affordances stay familiar. Responsive adaptation should preserve reading order and emphasis rather than merely shrink desktop cards.

### Iteration that improves the experience

Treat the first working render as a candidate. Before polishing, inspect the primary viewport, a representative content detail, and a narrow mobile view with actual or clearly labeled fixture content. Review the reading hierarchy, rhythm, shape treatment, density, identity, and clarity of the main action. Identify the few changes with the greatest user-facing benefit, implement them together, and compare the resulting renders against the selected direction.

Reserve an explicit visual iteration stage for new or substantially redesigned frontends. Address at least one material composition or interaction issue when review finds it; changing accent color alone does not satisfy a weak-layout finding. Finish when the direction is coherent, required interactions and states work, and no material visual or usability finding remains. If the first render already meets those criteria, accept it with evidence rather than manufacturing edits. Further purely subjective exploration requires a new design hypothesis or user steering; goal continuation must not drift into endless aesthetic changes.

The design record includes the chosen direction, representative before/after captures, reasons for substantive changes, and unresolved preference questions. Ask for aesthetic input when it would change the direction, without blocking useful implementation or verification work. The final reviewer explicitly checks that the softer treatment remains readable, actionable, and content-specific.

Avoid substituting a familiar generated-page recipe for design thinking: repeated equal-sized cards, interchangeable hero/features/testimonials sections, ornamental gradients, indiscriminate rounded containers, generic copy, and decorative statistics. These are review signals, not blanket bans on useful patterns. Each major section and visual treatment must have a content or interaction reason. Prefer content-specific composition, deliberate hierarchy, coherent details, and honest copy. Changing colors and fonts alone does not establish an original direction.

Accessibility and resilience are part of the quality floor: semantic structure, keyboard operation, visible focus, appropriate contrast, readable content, responsive reflow, reduced-motion support, loading/empty/error/success states, and long or missing content. Reuse the project's components and tools. Add dependencies or assets only when the task requires them. Use real imagery when it serves the brief and access/licensing permits; required unavailable assets must be reported rather than disguised as final placeholders. Check relevant performance costs instead of adding effects without measurement.

For parallel UI work, one design owner establishes the shared direction and contracts before implementation slices begin. Workers receive the same tokens, component boundaries, content/state requirements, and representative composition. Independent visual review inspects the combined result for inconsistency, weak hierarchy, generic composition, accessibility defects, and incomplete states. Thermonuclear review separately checks implementation structure. A visually attractive result does not excuse tangled code; passing code checks does not establish visual quality.

Verify the running interface on at least a representative desktop and narrow mobile viewport, plus any device classes required by the brief. Exercise the primary user flow, keyboard navigation, and relevant failure/empty states. Capture revision-bound screenshots and interaction results. The visual reviewer evaluates the brief against the actual render and identifies concrete defects and remedies, not an arbitrary beauty score. Batch fixes and repeat relevant checks; continue for material defects or failed acceptance criteria, not unlimited cosmetic polishing. If browser access is unavailable, record visual verification as incomplete.

Goal completion for frontend work includes the primary user task, direction fidelity, responsive and accessible behavior, completed required states, and a visual verdict grounded in rendered evidence. "Does not look AI-generated" is an intent, not an objectively provable label; acceptance uses specific composition, hierarchy, consistency, and usability criteria. Human preference remains valid steering input.

## Execution capabilities

Setup and each run discover capabilities and record what is supported. A needed missing capability changes the evidence plan or becomes a specific blocker; it never produces a false success.

CLI control uses existing shell/process tools. Interactive TUI control is a separate capability. UI control uses an available browser integration to exercise real flows and capture evidence. Browser, Electron, and native desktop support are declared separately. First-release automated UI acceptance targets browser applications. Do not assume a Playwright package grants access to the user's authenticated browser.

Both adapters document supported host tools and installation requirements. No playbook references an unbundled skill without a declared dependency or a documented supported substitute. Agent instructions and source content do not expand user authorization or host permissions.

## Goal execution and checkpoints

The host owns the active goal, continuation, interruption, and usage enforcement. The plugin owns work decomposition, acceptance criteria, task progress, and evidence. Do not install a second continuation loop around a native goal.

Codex adapter uses available goal status tools and follows their live contracts. Attach to an existing goal; create or replace one only when explicitly requested. Set no token budget unless requested. Complete only after objective criteria are met. Pause only on explicit user instruction. In the current tool contract, blocked status requires the same blocker in at least three consecutive goal turns with no meaningful path remaining. Host lifecycle rules take precedence if they change. Budget exhaustion checkpoints incomplete work; it never counts as completion.

Claude Code adapter composes with native `/goal` on supported versions. Goal evaluation relies on surfaced conversation evidence, so publish concise actual verification results and checkpoint references before turn completion. Respect host interruption and evaluator decisions. Where native goal support is unavailable, report that limitation and provide an explicit manual resume path; no automatic global Stop hook in the first release.

Plugin progress states are preparing, executing, reviewing, verifying, awaiting-input, stopped-incomplete, and complete. These are work states, not replacements for host goal states. A worker failure can block one task while independent tasks continue.

Store local run artifacts under `.engineering-team/runs/<run-id>/` in the target repository, excluded from version control unless deliberately exported. Run IDs are unique per coordinator session. `state.json` contains schema version, objective/design reference, criteria, repository/base identity, task assignments, task/review status, evidence references, limits supplied by the user, latest host status, and next action. Per-task files contain worker results. Evidence is bounded and excludes credentials and unnecessary sensitive data.

Only the coordinator updates state, by writing a temporary file and replacing the canonical file. Keep a last valid checkpoint. Write before delegation, after worker results/integration, after review/verification, and before yielding or stopping. A fresh continuation loads the contract, reads native goal state where available, inspects the repository, reconciles live agents/processes, and revalidates stale evidence. Never infer a worker is still running from a saved identifier alone. Do not replay an external side effect merely because its completion was not checkpointed; inspect its actual state first.

Explicit interruption stops new dispatch and uses supported cancellation for active work. Preserve work and report agents/processes whose cancellation cannot be confirmed. If completion is impossible under current constraints, checkpoint attempts, concrete blocker, remaining criteria, and the smallest input that unlocks progress. Host rules determine when the run may formally stop or be marked blocked.

Completion requires every required criterion proved on the integrated artifact, no unresolved material findings, no uncollected workers that may modify it, and a reviewable final change/report. Resolve any authorized delivery requirement, such as a PR, before completing. Publishing or merging requires authorization appropriate to the task. Passing tests alone is not the completion contract.

## Release acceptance and evaluation

First-release gates:

1. Both packages load in their real hosts; bundled references resolve and setup accurately reports capabilities.
2. A bug fixture reproduces before the change and passes afterward with behavior-level evidence.
3. A feature with two independent implementation slices integrates correctly and passes end-to-end checks.
4. A refactor preserves observed behavior and passes thermonuclear review with evidence for rejected/accepted findings.
5. A review fixture contains known material defects and an intentionally clean case; reviewers identify the defects without inventing findings in the clean case.
6. A native-goal run on each supported host continues through a failed check, a revision, and final verification without manual step prompting.
7. An interrupted run resumes without duplicate edits, overwriting unrelated changes, or accepting stale evidence. Host limits produce an incomplete checkpoint, not a success claim.
8. An unavailable model/browser and an overlapping-file assignment are handled explicitly. Ownership and review gates remain effective.
9. Independently started workers load the same standards; workers without a team assignment do not write a team's aggregate state.
10. TypeScript, Rust, and Python fixtures each demonstrate language-appropriate implementation and review. Existing project checks are respected, and no unrelated dependency/configuration changes are introduced. A mixed-language fixture verifies its shared serialization/API contract.
11. A data-driven fixture includes a baseline and experiment supporting the accepted decision. A clean-code fixture demonstrates a concrete simplification with behavior preservation; an already simple implementation does not receive invented abstraction demands.
12. Every shipped skill and instructional asset has a project specification and behavioral acceptance cases. An authorship review confirms no existing skill text, workflow, or supporting instructional asset was copied or adapted. Shared assets replicated between our own platform packages come from our canonical authored source.
13. Frontend fixtures cover a content-led public page and a task-led application interface with distinct briefs. Each demonstrates a reasoned direction, content-specific composition, responsive rendering, keyboard-accessible primary flows, and required loading/empty/error states. A refinement fixture preserves its incumbent identity. Review flags an intentionally generic composition and a deliberate usability defect with concrete remedies, while accepting justified standard patterns. Parallel UI slices remain coherent after integration.
14. An editorial fixture uses long headlines, author metadata, article content, and relevant imagery to test the preferred authentic, softer direction. Its index and detail layouts remain readable on desktop and mobile; radius choices are coherent without boxing every region. A before/after visual iteration addresses a seeded hierarchy or density defect with a substantive improvement and preserves keyboard usability. Acceptance evaluates our brief, not pixel similarity to Substack.
15. Language fixtures demonstrate pure domain logic with explicit dependencies and no unexpected caller-input mutation. A stateful fixture separates transition decisions from I/O and covers success, failure, and retry behavior without duplicate external effects. Review accepts justified local mutation and clear loops while flagging hidden shared state and unnecessary effect abstractions.

Use disposable repositories and pinned fixtures. Capture commands, revisions, results, manual interventions, elapsed time, reported usage, and diff size. Compare repeated team runs with a single-agent baseline on the same tasks. Smaller diffs are useful evidence, not an excuse to omit required behavior. Report variability; do not claim an improvement from one favorable run. Structural lint verifies packaging only; host-level behavioral evaluation establishes that the skills work.

Delivery sequence: trustworthy worker mode and shared principles; platform packages and setup; coordinated integration and model roles; thermonuclear review; goal recovery and evidence; real-host evaluations. Each step has a runnable acceptance case. Detailed implementation planning follows review of this design.

## Boundaries and open decisions

Every outgoing commit uses the original commit-features skill. Its message contains explicit `Major features` and `Minor features` sections describing the actual staged change, using `None` when a category has no changes, plus validation and material limitations when applicable. Major describes a substantial user-facing capability or architectural milestone; minor describes a smaller improvement, fix, documentation, or tooling change. These categories do not determine semantic version bumps; breaking compatibility is called out separately. Inspect the staged diff and relevant evidence, avoid invented features, and never claim tests not run. Existing commits are not rewritten merely to change formatting. Before pushing new commits, validate their message structure and review the actual outgoing range. Push only within the user's authorization; the skill does not grant publication permission.

Out of first-release scope: a hosted dashboard, global daemon, autonomous deployment, native desktop/TUI control, an automatic cross-provider bridge, and importing existing skills. Keep a capability inventory with specified/deferred decisions and evaluation coverage. Choose the project's license explicitly; retain any notices required by actual non-skill dependencies.

Brand and repository are now settled: Proofwork at github.com/zrmonty/proofwork, with a dedicated local checkout. Builder choices: build-script language, exact host agent-definition packaging, fixture repositories, and optional browser backend after capability discovery. Host versions are supported only after passing release evaluations; publish the tested version matrix rather than an untested minimum version.

## Sources and status

Product requirements come from this conversation. Architecture, defaults, release sequencing, and local state format are proposed design choices. No implementation or runtime validation has occurred.

- [Codex goals](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex): native goal lifecycle, continuation, and evidence-based completion.
- [Claude Code goals](https://code.claude.com/docs/en/goal): native goal support and evidence surfaced to its evaluator.
- [Claude Code plugins](https://code.claude.com/docs/en/plugins): platform packaging.
- [Claude Code hooks](https://code.claude.com/docs/en/hooks): continuation mechanism; a custom global loop is unnecessary for the proposed first release.
- The user's thermonuclear skill informed capability requirements. No skill text is approved for import or adaptation.
- Installed TypeScript and Rust skills informed earlier exploration. All three language skills will be authored independently to this specification and checked against official documentation during implementation.
- The frontend-design specification and instructional assets are independently authored; no external implementation is approved for import or adaptation.
- [Substack](https://substack.com/) and [On Substack](https://on.substack.com/) are user-requested references for editorial identity and content structure. The softer forms, radius suggestions, typography direction, and iteration requirements above are our proposed interpretation of the user's preferences, not measured claims about those sites' styles.
