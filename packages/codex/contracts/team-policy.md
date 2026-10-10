# Repository team policy

Teams may add up to three original principles or operational constraints to `.proofwork.json`; no plugin fork, new skill or model configuration is required. Merge the `teamPolicy` key into existing configuration without replacing commit/model options.

```json
{
  "teamPolicy": {
    "version": 1,
    "rules": [
      {
        "id": "earn-database",
        "statement": "No new databases without an architecture decision record.",
        "evidence": "Link the decision record and compared simpler alternatives.",
        "when": { "taskTerms": ["database", "databases"] }
      },
      {
        "id": "restore-before-migrate",
        "statement": "All migrations include a representative restore test.",
        "evidence": "Link the executed restore check, data scope and observed result.",
        "when": { "taskTerms": ["migration", "migrations"] }
      }
    ]
  }
}
```

Use `route --explain --repo <target-repo> --task <text> --files <paths>` to inspect applicable rules. The entry always uses this explained form. Plain legacy `route` retains its old shape and does not load policy. Optional host prompt hints include selected rule IDs; the root loads full text through explained routing. Configuration is read only, never auto-created or rewritten.

## Small, explicit selectors

A rule has a unique lowercase/hyphen ID (at most 48 characters), statement (at most 60 words), and required evidence (at most 40 words). No command, executable script or regular-expression selector is supported. `when` is optional; absent or empty means all eligible work.

Selectors:

- `stages`: compatible route stages: brainstorm, architecture, production-finish, investigate, bug-fix, feature, refactor, review, prototype.
- `taskTerms`: up to eight literal phrases, each at most four words; case-insensitive whole terms with punctuation normalized. Plurals are explicit. No inferred semantic matching.
- `paths`: up to eight relative repository paths or directory prefixes. `db` matches `db` and `db/schema.sql`, not `db-old`. Use forward slashes and repository-relative paths.

Values within a selector use OR; supplied selectors combine with AND. Unknown file scope cannot satisfy a path selector: inspect files and reroute before changes. Do not use a path-only selector for a universal obligation. Literal routing cannot identify every unmentioned database addition or migration; the agent must reconcile actual scope with selected policy and reroute material decisions.

Light work skips rules by default; `includeLight: true` explicitly opts a rule in without increasing the tier. Read-only work can assess applicable constraints but cannot perform their effects. Existing risk floors remain unchanged. At most three rules prevents turning normal work into an unbounded process catalogue.

## Ownership and evidence

Read policy at the Git root, or supplied root for non-Git projects. Existing repository instructions and direct user constraints still apply. Policy supplies team guidance, not permission to deploy, access credentials, execute a command or override host rules. Report conflicts and continue independent authorized work.

Explained output includes source, content digest, application mode and selected rules. Cite rule IDs only where they change a decision or require evidence. Record satisfied, pending, not-applicable-with-reason or explicitly accepted exception; identify evidence and owner. Never invent compliance from a passing build. Operator authority is required for material exceptions.

On resume reload policy and recheck decisions affected by a changed digest. Retain earlier evidence as history rather than claiming it proves a newly required check. Full-tier/Harden-and-Finish records these dispositions in the existing systems outcome; small reports stay short.

Configuration must be a JSON object, at most 64 KiB. Malformed policy fails visibly instead of being ignored. Configuration should contain no secrets. Rules are agent instructions with observable evidence obligations; this version does not install commit/push gates or certify organizational compliance.
