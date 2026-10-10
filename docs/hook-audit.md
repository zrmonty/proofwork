# Proofwork hook audit

Audited 2026-10-10 against Proofwork 0.14.0. This is a design audit; no lifecycle hooks, Git hooks, settings changes or executable handlers were installed.

## Recommendation

Use hooks to preserve a known operating contract at repeatable boundaries: recover context, remind the root of routing, expose changed-code violations, validate handoff and prevent unsupported completion claims. Keep product judgment, architecture selection, design critique and evidence interpretation in the skills. This supports skill compression by carrying routine discipline without taking consequential choices away from the user.

Start with scoped context restoration, active-run routing hints and read-only completion preflight. Add bounded changed-code feedback and worker handoff checks next. Put commit-message and outgoing-commit enforcement in native Git hooks, backed by CI. Introduce stricter tool guards only for narrow, demonstrably parseable operations and explicit ownership.

## Current evidence and gaps

- scripts/routing.mjs returns deterministic playbook/skill recommendations. The root interprets conversational context and re-routes the current subtask. A prompt hook can supply recommendations but cannot establish that a design is accepted.
- scripts/proofwork.mjs owns checkpoint mutations, locking, repository identity and evidence-file digests. Its complete command writes phase=complete. Reusing that command inside Stop would mutate state and interfere with continuation; a read-only completion preflight does not yet exist.
- Current runtime binds checkpoint/evidence to filesystem and Git identity, including dirty files. It cannot prove that a successful command establishes the intended criterion.
- Assignments contain owned paths; the CLI rejects overlapping assignments. It does not enforce every subsequent edit or authenticate the supplied owner against another local process.
- check-file-lines.mjs supports an explicit project policy and is disabled by default. No universal function ceiling applies. check-coverage evaluates counts; collect-coverage normalizes real LCOV and verify-coverage runs the source repository checks.
- check-commits.mjs exports checkMessage and checkRange. No commit-msg/pre-push installation or CI integration is bundled. Formatting is disabled by default; a pure validator default is not hook opt-in. Message structure cannot establish that its feature claims are true.
- Build currently ships skills, contracts, playbooks, principles, adapters and selected scripts. Neither package contains a hook configuration. README and adapters accurately describe no installed continuation hooks.
- Local Codex CLI reports 0.150.1 and hooks as a stable enabled feature. This establishes local feature configuration, not execution, trust or compatibility of a proposed handler.

## Where hooks fit

Event names below are verified against current official references; proposed behaviors are Proofwork design recommendations, not executed integrations. Host payload/output adapters must be separate even when events share a name. [Codex hooks](https://learn.chatgpt.com/docs/hooks), [Claude hooks](https://code.claude.com/docs/en/hooks).

| Priority / boundary | Events or placement | Proposed behavior | Existing owner and limits |
| --- | --- | --- | --- |
| First: active-run recovery | SessionStart; context refresh after compaction where the host supports it | Read the explicitly session-bound run and provide a compact objective, current playbook, next action, unresolved evidence and root path. Inactive sessions get no workflow injection. | Root recovery and run-state contract. No inferred success, worker liveness, external-effect outcome or automatic adoption of the newest checkpoint. |
| First: prompt-stage reminder | UserPromptSubmit | On explicit root invocation or an active bound run, call the router with the current prompt and safely derived relevant paths; inject a small recommendation and reminder to honor accepted context. | routing.mjs and root stage guidance. Never rewrite intent, select a model, create a goal, authorize implementation or silently change aggregate checkpoint state. |
| First: completion integrity | Stop | Run a new read-only preflight for current required criteria, relevant content identity, evidence hashes, open findings and outstanding effects; return a specific correction when a completion claim lacks support. | complete invariants and root completion guidance. Do not invoke the mutating complete command. Allow honest incomplete/awaiting-input reports, user stop, exhausted limits and non-completion replies. |
| Next: changed-code feedback | PostToolUse for edit tools and supported shell writes | Check bounded changed project-code paths against an explicitly configured project policy and material complexity findings. Report safe locations and required corrections. | pw-clean-code and file checker. No automatic refactor, excluded-source pass, brace-regex certification or full-suite run after each edit. Post events cannot undo a write; final inventory remains required. |
| Next: worker discipline | SubagentStart and SubagentStop; PreToolUse only when dispatch can be inspected | Supply pw-worker-mode and selected assignment context; validate the returned artifact identity, result contract and missing checks before handoff. | assignment/worker-result contracts. SubagentStart context is not a universal blocking dispatch gate. Read-only hook reports do not accept work, update aggregate state or prove integration. |
| Next: compaction/interruption preservation | PreCompact; Codex Interrupt; SessionEnd as best-effort cleanup | Preserve already observed hook-owned metadata and signal the coordinator's next recovery action. Keep uncertain effects explicitly uncertain. | Root owns aggregate checkpoint. Hooks cannot reconstruct unsaved intent, steal a writer lock, cancel unrelated processes or prevent a requested stop. An abrupt crash may emit no event. |
| Git enforcement | Native commit-msg and pre-push, with repository CI | Only after explicit commitFormat opt-in, commit-msg passes the actual message and configured format to checkMessage. pre-push uses Git's supplied source/destination ref data to validate actual outgoing commits and configured staged/release gates. | commit-features. Preserve existing hooks/signing; no generated message, silent amend, history rewrite, incidental network fetch or assumed authorization to push. CI supplies enforcement independent of agent tools. |
| Conditional: ownership/generated-source protection | PreToolUse on edits and inspectable shell operations | Check resolved target paths against an explicitly bound assignment and canonical/generated ownership; reject a recognized write to another active owner's paths. | assignment discipline and build ownership. Shell strings, alternate tools and interactive writes can bypass incomplete parsing. Do not market this as a security boundary. Isolated checkouts remain the stronger mechanism. |
| Conditional: sensitive delivery checks | Native pre-commit/pre-push or a configured pre-release command; narrowly supported PreToolUse advisory | Scan staged/release artifacts locally with output redacted before any tool/transcript emission; surface capability, location and disposition. | security-hardening and production-finish. An after-tool scrubber cannot undo a leaked transcript. No hook-based exhaustive security certificate, actual key rotation, deployment or automatic command approval. |

## Packaging and host-specific placement

Use a canonical pure policy layer such as shared/hooks/policy.mjs with small host input/output adapters under adapters/codex/hooks/ and adapters/claude-code/hooks/. These paths are proposed, not existing files. Build would copy handlers and the relevant configuration into each host package's hooks/ directory. Resolve the installed plugin root for executables and the explicitly bound target repository for artifacts; never assume the hook working directory is the plugin root.

Codex supports package-root hooks/hooks.json or a manifest-declared hook path. Current official packaging documentation restricts lifecycle-hook plugins to manual Codex desktop installation and excludes them from the public directory. Non-managed definitions need host trust review; enabling a plugin is not evidence that its hooks run. Keep a hooks-free public distribution if directory submission is a goal. Do not silently edit user-wide config or bypass trust. [Codex packaging](https://developers.openai.com/plugins/build/plugins).

Claude supports package-root hooks/hooks.json and manifest hook declarations. Its merge behavior differs from Codex's declared-path replacement behavior, so do not duplicate a default file through extra manifest configuration without checking for double execution. Session-scoped hooks in skill frontmatter are another supported Claude option; keep that host-specific configuration out of the shared skill source. [Claude plugin manifests](https://code.claude.com/docs/en/plugins-reference), [Claude hooks](https://code.claude.com/docs/en/hooks).

For an intentionally project-scoped installation, Codex uses the project's .codex hook/config layer; Claude uses its project settings. Native Git hooks belong to the repository's selected hooks path or established hook manager, not an agent event config. Existing user/project hooks must be preserved and composed deliberately. On Windows, validate executable invocation, arguments and paths with spaces against the actual hook host; do not assume a Unix shell.

## Prerequisites before implementation

1. Add explicit session-to-run and worker-to-assignment binding. A session may see multiple run directories; cwd, latest timestamp or arbitrary user-supplied run ID cannot choose its active authority. Hooks must be no-ops without a valid binding.
2. Extract read-only completion assessment. Preserve current owner/repository/content checks, evidence digests and latest-observation semantics. Separate a completion claim from an ordinary turn ending; native goal completion remains a host operation.
3. Give hooks their own observation files, bounded and atomic. The coordinator alone writes aggregate state. Avoid shared-file writes from concurrent hooks; duplicate events and late async results must not overwrite newer observations.
4. Verify event-specific JSON and error behavior for each installed host. Short synchronous checks can inform/block a supported boundary; async observations cannot retroactively gate an action and must carry the content identity they inspected.
5. Use bounded repairs and deduplication. Stop/SubagentStop callbacks can create continuation loops. Respect stop_hook_active, user interruption, supplied limits and missing external prerequisites. Do not run every audit or keep retrying unavailable coverage metrics.
6. Collect current-artifact test/type/coverage evidence through configured checks. A shell exit zero is not a normalized criterion pass, and a coverage threshold cannot be enforced without an inventoried report. Preserve the documented coordinator coverage gap rather than fabricating a release gate pass.

## What should stay in skills

Brainstorming, whether to revisit architecture, contextual visual judgment, domain/security reasoning, what work is worth parallelizing and whether evidence supports a user outcome all require the task's context. Hooks should remind or check recorded obligations, not implement a second agent scheduler or turn every prompt into a fixed phase pipeline.

Do not automatically run audit-stack, all language linters, expensive benchmarks or whole-repository tests after every tool call. Do not infer Docker/hosting from a stop event. Do not spawn reviewers or switch models from a hook without existing authorization and concrete scope. The right hook reduces forgotten discipline; an indiscriminate one adds latency and noise.

## Acceptance plan

Before any rollout, test synthetic event payloads and actual host events in disposable repositories: inactive session no-op; ambiguous run binding refusal; resume and compaction context; unknown payload/tool handling; duplicate/concurrent observations; changed artifact after a passing check; worker output with no evidence; incomplete/awaiting-input/stop exits; recursion guard; Windows paths with spaces; local-tool absence; secret detection with no value emitted; staged versus unstaged content; multiple push refs and newly created remote branches; configured hooks disabled/untrusted. Verify no writes to installed packages, other assignments, global config or native goal state.

The audit used source inspection, CLI version/feature observations and fetched official references. No handlers were authored, no live hooks were fired, no application security scan was run and no existing runtime tests were repeated for this documentation-only audit.
