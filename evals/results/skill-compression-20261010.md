# Skill-compression direction verification

Date: 2026-10-10. Version: 0.13.0.

## Delivered direction

Skill compression is Proofwork's main product goal: users steer through intent, taste and judgment while the plugin carries engineering detail and supplies current-artifact evidence. docs/vision.md defines the division of responsibility, creative iteration, finish line and evaluation criteria. The phone-camera analogy is a direction, not a historical or predictive claim that technical expertise disappears.

README and the original design document now lead with that goal. The root has operational guidance and a conditional intent-and-judgment reference for ordinary briefs, experiential corrections and consequential choices. Workers resolve routine implementation details in assigned scope; architecture recommendations explain workflow, durability, ownership and cost rather than demanding tool vocabulary. Specifications and the authoring standard map these decisions. Generated host descriptions and package README introductions reflect the same purpose. No new command, runtime service, hook or public schema was added.

## Observed verification

- Initial package check failed because local editing changed three skill entry files to CRLF, which the existing frontmatter check rejects. Restoring their LF endings resolved that failure without changing parser behavior.
- npm run check then passed all 25 tests, both 21-skill package builds and the 500-line file gate over 20 default-discovered code files.
- UTF-8 skill validation passed for use-proofwork, worker-mode and architecture-fit.
- Strict Claude plugin validation passed with informational marketplace-install README advice.
- Repository-aware local link checks passed for the changed overview documents; package build checks passed package-local references.
- git diff --check passed; excluded-name scan returned no matches in README, shared, docs or packages.
- An independent read-only agent reviewed the vision, root, new reference, shared principles and current diff. It reported no material contradictions and explicitly limited its conclusion to text inspection.
- Codex installed proofwork@proofwork-local version 0.13.0. SHA-256 parity passed for all 82 packaged skill/reference files plus principles, manifest and package README.

## Limits and next evidence

No newcomer comparison, target application build, rendered product evaluation or fresh CLI end-to-end workflow was executed for this direction change. Authored acceptance examples and proposed measures do not establish behavior or a quality gain. Evaluate comparable ordinary-intent tasks for verified completion, avoidable technical decisions handed back, clarification burden, useful-slice latency, correction/recovery behavior and delivered defects. Preserve expert inspection and consequential authority as acceptance conditions.

Existing coverage, strict typing, code-size, security and evidence requirements remain in force. No repository-wide function audit was performed, and no automatic ten-line function checker was added.
