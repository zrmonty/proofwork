# Specification: pw-principle-boundary-discipline

Citable principle: `boundary-discipline`. Trigger: Use when untrusted inputs or external effects cross a boundary.

Decision contract: Keep validation, authorization, errors and cleanup with their real owner. Internal types rely on truthful construction; pure proposals grant no commit or delivery authority.

Acceptance evidence: Exercise malformed input and a rejected operation without prohibited effects.

Apply only to the actual assignment. The principle adds a decision lens, not a second workflow or authorization. Packaging validation establishes discoverability, not agent compliance.
