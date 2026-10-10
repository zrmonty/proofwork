# Proportionate recovery verification — October 10, 2026

Source version 0.32.0. This record covers routing, recovery instructions and executed hook-policy fixtures, not an agent-quality comparison or native host certification.

- `npm run check` passed on Node 24.16.0 / Windows. The independent 20-script inventory covered 2,368/2,400 lines (98.67%) and 1,467/1,510 branches (97.15%). Runtime identity: `scripts-sha256:1f06e4fa9537c70ff99bb938a2fd3a60b8fd4063e72bb29a5a36bbb18f1c12dd`.
- The 94-case corpus passes. Initial corpus context is 161,894 words; maximum light case is 630 words. Existing 800-word light and 4,000-word standard limits remain unchanged. Dedicated resumed Rust-edit and explanation cases also pass the light limit.
- Focused routing/context/hook tests: 36 passed. Documentation-only inventories remain light; interrupted typo work selects the small recovery guide; behavioral, security and concurrency requests retain risk floors.
- Isolated hook fixtures for both adapters observed no run-state writes during an unbound light resume or Stop. A bound verifying run retained its missing-evidence block after a light prompt. An honest stopped-incomplete checkpoint stopped blocking and restored its concrete next action at SessionStart.
- Normal and optional-hook package builds passed; standard Codex installation verified version 0.32.0. No lifecycle hooks or model settings were installed or changed.

An interrupted check is not a passing result. Light recovery preserves the diff, rechecks affected evidence and reconciles uncertain external effects. These are shipped instructions; fixtures prove policy/runtime behavior, not that every model follows those instructions. Native Codex/Claude interruption dispatch and newcomer time-to-result remain unverified.

[Windows and Ubuntu CI](https://github.com/zrmonty/proofwork/actions/runs/38087156819) passed full checks and optional-hook build parity for source commit `c513f41`.
