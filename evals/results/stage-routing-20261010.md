# Stage-routing verification

Date: 2026-10-10. Version: 0.14.0.

## Delivered behavior

Root invocation considers the prompt and inspected/accepted context before implementation. New or unresolved projects use the original brainstorm skill; consequential technical decisions use architecture-fit; accepted direction moves to implementation. Bug fixes, investigation, review, refactoring and production preparation retain their appropriate scope. The root re-routes the current subtask after material answers and transitions, retaining the overall objective and unaffected evidence.

The deterministic route API still returns playbook and unique skills. Brainstorm, architecture and production-finish playbooks are now routable and checkpointable. Routing logic lives in a pure, locally owned module copied into both packages. The existing public export remains compatible. The new module's function definitions and new test callbacks were manually inspected against the ten-line cap; pre-existing coordinator/build functions were not certified or rewritten under that cap.

The brainstorm skill owns audience, outcome, journey, tangible options and the first useful slice. It hands a working brief to architecture or implementation when appropriate; brainstorming-only scope does not authorize either. Architecture-only and production-finishing playbooks preserve their separate authority boundaries. README includes stage mapping and the new command.

## Observed checks

- Initial 13 new behavior tests: 11 failed and 2 passed before implementation, with stage-selection and invalid-checkpoint assertions exposing missing behavior.
- The first integration run exposed a lost production-finish lens on combined audit requests; restoring domain-skill selection preserved the previous behavior.
- Final npm run check: all 42 tests passed, both 22-skill packages built and the 500-line file gate passed over 22 default-discovered code files.
- UTF-8 validation passed for brainstorm and use-proofwork. Strict Claude plugin validation passed with informational marketplace-install README advice.
- Node experimental test coverage with the LCOV reporter measured the new routing module at 83/83 lines and 69/70 branches. The separate bundled coverage gate passed those counts (100% lines, 98.57% branches).
- The broader measured target including scripts/proofwork.mjs failed its branch gate: 255/255 lines and 191/216 branches (88.43%). This retained coordinator coverage gap is not closed by the new module's scoped pass. No whole-runtime or whole-repository 95% claim is made; build/other scripts also have existing coverage gaps.
- Independent read-only review found no material defects. It observed stage/checkpoint tests and successful architecture/brainstorm route calls from the respective generated packages. It did not execute a conversational agent workflow.
- Changed overview local links, package references, whitespace checks and excluded-name scans passed.
- Codex installed proofwork@proofwork-local 0.14.0. SHA-256 parity passed for all 83 skill/reference files, routing/coordinator scripts and three new playbooks.

## Limits

Keyword routing is a starting recommendation and has no conversation state or empty-repository detector. For example, an agreed brief phrased differently from approved design/plan/spec can still recommend brainstorming; root instructions require correcting this against accepted context. The stage lifecycle is agent guidance plus checkpoint persistence, not an automatic phase engine. No new goal, scheduler or permission was created. Full conversational stage progression, creative quality and comparative newcomer outcomes remain unevaluated. Broader coordinator branch coverage and pre-existing function-size compliance remain explicit gaps.
