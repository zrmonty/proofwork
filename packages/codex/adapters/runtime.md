# Proofwork runtime

## Entry and discovery

Use the installed `use-proofwork` skill as the entry. `$use-proofwork <task>` is an explicit skill invocation; select the skill through the slash menu where exposed. `/use-proofwork` describes the product entry but is not a guaranteed registered CLI slash command. Repository marketplace/config supplies local loading metadata, but automatic discovery depends on the host's supported discovery and trust behavior; confirm listing in a fresh session before relying on it. Invocation automatically reads the root skill, which routes the task and loads relevant guidance; capability setup is conditional.

## Shell, subagents and browser capabilities

Discover live tool availability before dispatch. In the desktop host, native collaboration tools can spawn bounded workers, send messages, inspect status and wait; native shell tools execute project commands. Other Codex surfaces may expose different agent tools. Do not invent tool names, assume shared checkout behavior, or dispatch through another chat without authorization. Each worker gets explicit ownership, acceptance criteria, selected skills and a result contract. Respect actual concurrency limits; reduce the team when capacity is lower. Never depend on inherited context alone.

## Models and evidence

Keep user model settings by default. A role mapping may select only models the host actually supports. Record requested and actual model metadata when available; report unknown values. Cross-provider orchestration is not provided by this package. Run artifacts and recorded evidence live in the target repository, not the installed package. Use [goal lifecycle](goal.md), [CLI control](control-cli.md), [browser control](control-ui.md), and [checkpoint interface](../scripts/README.md).

## Model-role dispatch

Run `node <plugin>/scripts/model-roles.mjs plan --repo <project> --host codex --inventory <inventory.json>`.
Supply an observed inventory array with `id`, `strengths`, supported `reasoning` levels and `available` for each model.
Without `.proofwork.json` `modelRoles`, all roles inherit. An explicit empty object opts into capability selection;
role overrides contain `model` and `reasoning`. Read each role's `requested`, `resolved` and `capabilityMissing`;
never dispatch unresolved roles. Sibling `modelBudgets` limits candidates, reviewers, parallel workers and optional
tokens. The plan does not execute workers or enforce budgets; the coordinator must enforce available limits.

Translate resolved roles through the live spawn tool's supported model/effort fields, under its override and context
rules. Omit fields marked `inherit`; the host can use the selected model's default effort. Custom agent definitions
can override requested settings, so inspect actual metadata and report mismatches before accepting results.
An authorized CLI worker can use per-invocation `codex exec --model <observed-id>` and
`-c model_reasoning_effort=<supported-level>` when supported; preserve user configuration and account boundaries.
Do not substitute an unsupported model or assume another provider is accessible.
See [official subagent model precedence](https://learn.chatgpt.com/docs/agent-configuration/subagents).

Give reviewers fresh bounded context: acceptance criteria, the actual diff and verification artifacts. Omit the
implementer's persuasive rationale. Record requested versus observed model and effort, or `unknown`. A different
model is a useful preference, not proof of independent review; evaluate findings against the code and tests.

## Installation and host contract

Packaging source: https://developers.openai.com/plugins/build/plugins ; skills: https://developers.openai.com/plugins/concepts/skills . Manifest uses `.codex-plugin/plugin.json` with `skills: "./skills/"`. Local loading is evaluated separately from structural validation.

In Codex CLI 0.150.1, from the trusted marketplace checkout, run `codex plugin marketplace add . --json`, then `codex plugin add proofwork@proofwork-local --json`, and verify installed/enabled/version using `codex plugin list --json`. Start a fresh session to verify skill discovery. Repository marketplace metadata alone is insufficient. A local marketplace references the checkout, so keep it available; rebuild then reinstall after changing the package version. These commands add only the requested marketplace/plugin configuration. Model support differs across Codex surfaces; if the configured CLI model is rejected, report it and obtain authorization for a supported per-invocation model rather than silently changing the user's default.

## Invocation policy

For a manual-only skill, Codex supports `policy.allow_implicit_invocation: false` in that skill's `agents/openai.yaml`. Explicit `$skill` invocation remains available. This is host metadata, not a portable SKILL.md frontmatter key. See [official skill metadata](https://learn.chatgpt.com/docs/build-skills). Confirm discovery and invocation in the actual host; metadata validation is a separate check.

Standard packages contain no lifecycle configuration. The separately built opt-in package puts host hooks in
`hooks/hooks.json` and shared handlers in `scripts/`. Review and install through the host's supported trust flow.
SessionStart recovers an explicitly bound run; UserPromptSubmit recommends a route; Stop performs read-only
completion preflight in reviewing/verifying regardless of wording, with a recursion guard. Supply actual host/session
identity to `init --host codex --session ID` for automatic binding. Checkpoint awaiting/stopped before an incomplete
report. Missing Stop fields produce an advisory. Never infer a newest run or restart stopped work.
