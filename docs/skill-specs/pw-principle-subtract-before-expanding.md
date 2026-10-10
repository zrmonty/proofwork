# Specification: pw-principle-subtract-before-expanding

Citable principle: `subtract-before-expanding`. Trigger: Use when a change introduces another mechanism.

Decision contract: Inspect obsolete responsibilities and existing facilities first. Remove redundancy when its consumers are understood; never delete a live guard merely to shrink code.

Acceptance evidence: Name removed responsibilities and checks preserving their former live contracts.

Apply only to the actual assignment. The principle adds a decision lens, not a second workflow or authorization. Packaging validation establishes discoverability, not agent compliance.
