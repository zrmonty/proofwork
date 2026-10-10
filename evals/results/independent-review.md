# Independent development review

Reviewed October 10, 2026 by a separate review agent. Scope: the original shared skills, contracts, playbooks, platform adapters, scripts/proofwork.mjs, scripts/check-commits.mjs, tests, and the design specification; all currently uncommitted source was included. External impact-analysis guidance and the user's thermonuclear review were read for development review only. No existing skills were copied into this report or product. Packaging was still under construction at this inspection.

## Blocking finding

P1: A failed current check can coexist with an older pass and still complete. In scripts/proofwork.mjs:87, completion accepts any passing observation for a criterion and revision. The filesystem validation at :148 likewise filters only passing entries. An actual Node execution recorded old-pass=true and new-fail=false for criterion works at revision r; complete returned phase complete. This is a structural false positive independent of artifact hashing: a repeatable check can fail on unchanged code due to integration environment, flaky dependencies, or newly discovered behavior. Preserve failed observations, but require an authoritative latest observation or explicit adjudication per criterion/revision, and reject unreconciled failures. Add a regression that records a pass, then a fail with a different ID at the same revision, and refuses completion until a new verified pass resolves it.

## Deferred robustness concern

P2: Accepted records are not isolated snapshots. At scripts/proofwork.mjs:41, assignment copies only the record shell, retaining its files array; at :55 evidence retains the entire record. Actual Node execution pushed unassigned.ts into the original assignment.files after transition and observed it appear in the returned state's ownership. This does not show input mutation during transition, and the standalone CLI does not retain those references across invocations. If transition is intended as a reusable snapshot API, clone the incoming record once at the boundary or explicitly document shared reference ownership. Do not call this a security boundary or impure function merely because its output shares references.

## Guided behavioral observations

This is a separate reviewer interpreting the actual authored instructions, not a fresh installed-host integration test. The root skill, worker mode, setup, thermonuclear review, functional and language skills, frontend skill, contracts, and both host adapters were actually read.

1. Revision A evidence after export changes at B: inspect the changed path, checkpoint B, rerun affected integrated checks, record current evidence. If limits stop the run, leave it incomplete. Root evidence invalidation and run-state rules support this. Native baseline already passed this generic safeguard; no improvement claim.
2. Worker needs shared/config.ts owned by another worker: report the interface need to the coordinator, request reassignment or approved isolation, and continue independent owned work. Do not edit outside ownership or aggregate state. Worker mode explicitly supports this. Native baseline already addressed overlapping writes appropriately.
3. Review-only cohesive module crosses 980 to 1002 lines without behavior evidence: report the presumptive size blocker, inspect cohesive boundaries, require either concrete restructuring or a compelling structural exception, and distinguish unproven correctness from maintainability. Do not edit or post externally. Without context sufficient to judge the structural exception, verdict is insufficient evidence. The authored thermonuclear skill adds the project's named verdicts and presumptive rule; baseline offered restructuring but did not encode that contract.
4. Shell/subagents exist but browser and Claude bridge do not: disclose unavailable live browser verification and requested cross-provider review; continue shell-supported work and leave required visual evidence incomplete. Do not silently substitute the reviewer model or claim screenshots. Setup and adapters explicitly support this. Native baseline already rejected absent-browser claims.
5. Rust feature in active goal: resolve installed package root, read runtime/goal/tool reference, invoke bundled route using safe host arguments, read returned feature playbook and worker/functional/data/clean/Rust skills, preserve active objective, checkpoint and dispatch explicit owned assignments. Gather results, perform independent integrated review/checks, complete only with current evidence and collected workers. This routing/checkpoint contract was absent from the baseline and is a product-specific addition, not evidence of better coding outcomes.

Language guidance explicitly covers boundary validation, pure supplied dependencies, cancellation, mutation ownership, and project-local tools. Frontend guidance supplies a brief, composition alternatives, coherent rounded treatments, content-led structure, real browser evidence, and independent review without requiring approval for delegated aesthetics. These are effective instructions on inspection; fixtures and real runtime behavior remain necessary to establish execution.

## Cleared concerns and limitations

Codex adapter explicitly states $use-proofwork and slash-menu discovery, with no promise that a bare slash command is registered. Claude adapter explicitly uses /proofwork:use-proofwork. Thus invocation is honest about platform differences. The root consistently calls bundled tools automatically and corrects router recommendations against actual inspected scope.

Goal adapters preserve native ownership, explicit activation, current artifact evidence, and incomplete resource-limit checkpoints. They do not add a scheduler, fake bridge, permission bypass, or global hook.

The commit skill requires actual staged/outgoing diff inspection, both feature sections, honest validation, and authorization for push. The checker only validates format and says so.

Authored skills are independently structured around Proofwork's own specifications. No copied installed-skill body was observed. This inspection is not exhaustive text-similarity/provenance certification.

The core script is roughly 180 lines with pure decision and filesystem layers; no 1000-line growth or unjustified framework survives inspection. Do not split this small script simply to satisfy an architectural preference. Maintainability verdict: meets the bar, subject to resolving the concrete completion correctness finding. That verdict is separate from complete runtime correctness.

Skipped: real Codex/Claude plugin loading, browser operation, goal continuation, and package consistency while build outputs were still being authored. Risk: instructions alone cannot prove real-host parallel integration or honest evidence reporting; those release gates remain outstanding.

## Follow-up verification

The tooling worker resolved both reported concerns during review. scripts/proofwork.mjs now clones incoming records at the transition boundary, requires the latest observation for each criterion/revision to pass, and hashes that same authoritative artifact during filesystem completion. I read the revised implementation and regression covering record aliasing and pass-then-fail; actual `node --test tests/*.test.mjs` passed all 7 tests. Both findings above are historical and cleared. Final maintainability verdict: meets the bar. No blocking source concern remains from this review.

Packaging source became available and was inspected: scripts/build.mjs assembles identical canonical shared sections with host-specific adapters/manifests, validates local links, and restricts removal to build-owned package destinations while rejecting symlinks. Current manifests use host-specific hidden plugin directories and declare the same version/skills. No unjustified abstraction or unsafe broad deletion was found. These source and structural checks do not certify host loading. Native goal continuation and behavioral release gates remain outstanding.

## Final delivery review

Re-read final README, AGENTS.md, CLAUDE.md, docs/verification.md, both repository marketplace entries, commit checker and the real Git range regression. Executed `npm test`: 10/10 passed. Executed `npm run build`: both host packages assembled, 12 skills each. No new concrete delivery blocker or unsafe behavior was found. Maintainability verdict remains meets the bar.

Verification documentation correctly separates an actual isolated Claude marketplace installation from authenticated Claude task execution; a Codex worker explicitly loading the staged root from automatic Codex marketplace/command discovery; and the parent build's native goal from demonstrated installed-plugin goal continuation. Native goal continuation, browser operation, Codex marketplace discovery, and cross-provider coordination remain unverified. No claims of quality/cost improvement over the passing baseline are made. Original-authorship statements are appropriately described as review evidence rather than automated certification.

Skipped additional real-host task runs and external publication checks; these limitations are stated in the delivered documentation. No blocker was inferred solely because those broader certification gates remain outstanding for the clearly identified development release.
