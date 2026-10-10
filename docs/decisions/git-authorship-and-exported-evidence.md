# Git authorship and exported evidence

## Decision

Automation-authored changes use the explicit Git identity `Proofwork automation <proofwork-automation@example.invalid>` for the next authorized commit. This identifies the actual automation contribution without publishing a local operating-system account or implying that a human personally authored the generated patch. It does not authorize committing, pushing, changing global Git configuration or rewriting existing history.

Preserve the existing author of human-owned commits. Apply automation metadata to the intended new commit through explicit per-invocation options or repository-local settings where authorized; do not infer identity from workstation paths. Do not amend historical authors, spoof a collaborator or replace another contributor's attribution. The invalid example-domain address is deliberately non-deliverable, not an account or contact claim.

## Export policy

Published evaluation results preserve observed versions, commands, success/failure, coverage limits and content hashes. Replace workstation-specific roots with explicit placeholders such as `<checkout>`, `<temporary-workspace>`, `<temporary-config>` or `<local-skill-catalog>`, retaining meaningful relative paths. Do not publish private session identifiers, transcript paths, usernames, email addresses, credential material or raw host logs. Public repository links remain useful provenance and are not private workstation identity.

Exported native payload confirmation records field names and types, not their values. A host label such as `claude-code` identifies the tested product; a machine/session identifier identifies a private environment and is excluded. Raw evidence stays local and ignored. Sanitized snapshots are historical reports, not executable runtime state: placeholder repository paths must not be loaded as a live run.

## Scope and limits

This cleanup removes local identifiers from current exported results and design notes. It does not erase earlier Git history, remote caches or already shared copies. Historical content/evidence hashes remain as provenance; no claim is made that sanitization preserves a raw artifact's digest. Repository checks and privacy review must inspect future exports before publication.
