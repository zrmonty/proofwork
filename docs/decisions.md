# Implementation decisions

- Brand: Proofwork; entry skill: use-proofwork, as requested October 10, 2026. Earlier team-mode references in the discussion were working names.
- Repository: the dedicated local Proofwork directory connected to git@github.com:zrmonty/proofwork.git. Existing remote inspected and empty at start. No Document Prep product code changed.
- Skills are original authored assets. External development guidance is not a runtime dependency.
- Node built-ins support deterministic routing, safe local checkpoints, packaging, and commit formatting checks. The shipped plugin adds no dependency for these operations.
- The user authorized autonomous completion and subagents. Routine choices do not require further approval. External release publication and unsupported runtime claims remain out of scope.
- Host-native goals govern continuation. The plugin does not install a second loop or silently replace objectives.
- Native command namespaces are preserved. Claude plugin command is /proofwork:use-proofwork; Codex uses its skill discovery and $use-proofwork invocation. A bare slash alias cannot be guaranteed by plugin text.
- Major/minor commit headings describe change significance, independently of semantic versioning.
- License defaults to MIT for the originally authored implementation. No existing instructional files are relicensed by this decision.
- The checkout had no Git author configured. Repository-local commits use Proofwork automation with a non-routable example.invalid address; personal/global Git identity is untouched.
- Full dual-host behavioral certification requires actual authenticated host runs. Unavailable authentication is recorded separately from manifest validation.
