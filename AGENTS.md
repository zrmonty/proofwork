# Proofwork development

The product entry is use-proofwork. When a task invokes `/use-proofwork`, `$use-proofwork`, or asks to use Proofwork in this repository, read `packages/codex/skills/use-proofwork/SKILL.md` and follow its bundled routing. Build the package first if it is missing; do not pretend reading a root skill guarantees host plugin installation.

Author every instructional asset originally to the specification. Existing skills may guide development but must not be imported, adapted, or mechanically paraphrased into shipped assets. Edit canonical `shared/` and `adapters/`, then rebuild generated packages.

Match the dominant codebase style first. Preserve caller-owned data and name mutable owners. Use the conditional functional-programming skill for stateful workflows, retries, concurrency, caching or shared mutable state; apply its extraction test rather than a blanket purity default. Use targeted behavior tests and staged-diff-based commit messages. Honor the repository commit convention. The optional commitFormat setting defaults to off; enforce outgoing message formatting only after explicit opt-in. Never rewrite history or block a push for this policy without opt-in.

Keep runtime artifacts local unless deliberately exporting sanitized evidence. Never commit credentials, raw provider transcripts, or unnecessary user data. Record executed verification and gaps; host certification requires actual host behavior.
