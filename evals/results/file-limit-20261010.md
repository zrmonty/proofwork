# Hard file-limit verification

Date: 2026-10-10. Package version: 0.6.0.

The 500-physical-line maximum is now shared engineering policy and explicit in clean-code, worker-mode, root completion and thermonuclear review. Exactly 500 is permitted; 501 is a violation. Blank/comment lines count. Tests, scripts, generated application code and already oversized project code receive no exception. Cohesive decomposition preserves contracts and ownership; minification and discovery manipulation do not satisfy the requirement. The old 1,000-line presumption and structural-exception wording were replaced in canonical review guidance, examples, specifications and the design document.

The bundled read-only check-file-lines.mjs discovers Git-tracked and non-ignored untracked code using source extensions and build-script names. An explicit JSON inventory adds custom, extensionless or ignored code paths; it cannot replace discovered files. The fixed limit has no override. The tool reports discovery gaps rather than treating unreadable/no-source inspections as passing. Discovery completeness and stable final-artifact identity remain coordinator obligations.

Executed checks:

- Both new tests passed: physical newline counting and the real 500/501 boundary across tracked, untracked and additionally inventoried files. A 501-line file produced a nonzero CLI exit; an attempted limit override and traversal inventory were rejected.
- npm run check passed all 22 tests, built both 17-skill packages and ran the file gate on the generated result.
- The final repository scan inspected 20 code files, all at or below 500 lines. The largest was tests/proofwork.test.mjs at 204 lines.
- Independent read-only review reran the two focused tests and found no material checker or integration defects. It identified minor specification drift, corrected before delivery.
- Claude strict plugin validation passed. Codex 0.6.0 was installed; the package includes the checker and updated skill guidance.

These checks establish the inspected repository result and policy boundaries, not comprehensive recognition of every language or architecture quality. Application-specific inventories must include ignored/custom project code and generated release code. External dependencies and prose/data artifacts are not project source. Snapshot races, malicious concurrent mutation and all supported source encodings were not exhaustively tested.
