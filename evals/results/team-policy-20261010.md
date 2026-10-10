# Repository team policy verification — October 10, 2026

Proofwork 0.34.0 adds repository-local policy, not organizational compliance certification. No policy was enabled on this repository, and no project configuration was rewritten.

## Executed checks

- `npm run check` passed on Windows / Node 24.16.0. Independent coverage includes all 21 canonical runtime scripts: 2,483/2,515 lines (98.73%) and 1,573/1,624 branches (96.86%). Runtime identity: `scripts-sha256:8fe2c613a07a0e16a873133a33e574976f31de3259829e17ab0a029eb4c38600`.
- `node --test tests/team-policy.test.mjs` passed six executed fixture tests: selection/input preservation, default/light/read-only behavior, AND/path boundaries, malformed/oversized policy rejection, CLI/both prompt adapters, and Git-subdirectory configuration discovery.
- Configuration changes alter the reported content digest; required evidence and rule IDs remain visible in explained routing. Existing commit/model keys are read without mutation. Rules install no commands or gates.
- The 94-case routing corpus, listing and context gates pass. Initial corpus context is 165,978 words; maximum light corpus case is 672 words. Dedicated light Rust-resume checks remain below the unchanged 800-word limit. No new skill-list entry was introduced.
- Normal and optional-hook package builds passed. Standard Codex installation verified version 0.34.0, without changing models, lifecycle hooks or project policy.

## Behavioral contract and limits

Up to three rules live in `.proofwork.json`. Literal phrases, route stages and repository-relative paths select rules; unknown paths need discovery and rerouting. Selectors do not infer unmentioned migrations or database changes. Light work skips rules unless explicitly opted in. Read-only work can assess compliance but cannot execute operational requirements.

The entry applies selected rules and records IDs, dispositions, evidence/gaps and ownership in existing reports or systems outcomes. Resume reloads policy and reassesses affected decisions on content changes. Invalid policy fails visibly rather than silently dropping a requirement.

Executed tests establish resolver, CLI, adapter-policy and packaging behavior. They do not prove native host dispatch, model adherence, the adequacy of a team's restore test or enforcement of every organizational requirement. Team policy is an instruction/evidence contract; existing runtime guards are not extended into arbitrary policy or push enforcement. The operator retains authority over material exceptions and deployment.
