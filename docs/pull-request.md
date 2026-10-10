Proofwork turns a task into a coordinated engineering run with explicit worker ownership, review, and evidence required for completion. This first development release provides original skills and separate installable packages for Codex and Claude Code.

Included:
- `/use-proofwork` root routing, worker contracts, checkpoint recovery, native-goal adapters, and safe local run-state tooling.
- Twelve original skills covering functional programming, TypeScript, Rust, Python, data-driven development, clean code, frontend design, maintainability review, setup, orchestration, and outgoing commit feature summaries.
- Independent review, skill specifications, behavioral evaluation fixtures, package manifests, and installation documentation.

Validation:
- All 10 automated tests pass; both packages build with 12 skills each.
- Claude Code strict package and marketplace validation pass. Installation succeeds using an isolated Claude configuration directory.
- A fresh Codex desktop subagent explicitly loaded the staged skills, reproduced an export bug, repaired it, and returned evidence. Parent review and rerun passed the completion guard.
- Both outgoing commits pass the Major features / Minor features message checker. Git whitespace checks pass.

This is a draft development release pending broader host certification. Codex CLI tool execution was blocked by its effective sandbox, and its repository marketplace was not discovered in this environment. Authenticated Claude tasks, fresh installed-plugin goal continuation, Rust/Python project tasks, and frontend browser verification remain untested. The verification report documents these limits without claiming a benchmark improvement.
