# Proofwork development

The product entry is use-proofwork. When a task invokes `/use-proofwork`, `$use-proofwork`, or asks to use Proofwork in this repository, read `packages/codex/skills/use-proofwork/SKILL.md` and follow its bundled routing. Build the package first if it is missing; do not pretend reading a root skill guarantees host plugin installation.

Author every instructional asset originally to the specification. Existing skills may guide development but must not be imported, adapted, or mechanically paraphrased into shipped assets. Edit canonical `shared/` and `adapters/`, then rebuild generated packages.

Use pure functions for domain decisions, explicit effect boundaries, targeted behavior tests, and staged-diff-based commit messages. Every newly authored outgoing commit includes Major features and Minor features sections, using None when appropriate. Validate its actual outgoing range with scripts/check-commits.mjs.

Keep runtime artifacts local unless deliberately exporting sanitized evidence. Never commit credentials, raw provider transcripts, or unnecessary user data. Record executed verification and gaps; host certification requires actual host behavior.
