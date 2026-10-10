# Host and environment parity — 0.35.0

Scope: install invocation, routing paths and evidence execution, with no global PATH/model/permission changes.

Executed fixtures use temporary directories with spaces and Unicode. Both host installer adapters execute a fake
Node CLI with literal source arguments. Evidence checks preserve metacharacters and empty arguments, record exits
0 and 7, fail on timeout, and surface missing executable errors. The full evidence CLI path rejects conflicting
modes and malformed argv before spawning, then records a successful observation against the checkpoint identity.
Windows-style policy paths select the same rules as Unix paths without changing caller input. Claude source-folder
version tests distinguish the loaded folder from a cached install and reject unknown loaded versions.

Local `npm run check` passes: 2508/2540 lines (98.74%) and 1620/1671 branches (96.95%) across 21 canonical
runtime scripts. Runtime identity: `scripts-sha256:e22c80c933b438edc738ef37a040f2bc0360db7d7701d80b51716b2bb02d832d`.
The focused install/evidence/policy checks pass, including a symlink-parent CLI regression. Context budgets, standard packages and optional hook packages pass.
Codex's native installer reports 0.35.0 enabled from the local source. CI expands to Windows, Ubuntu and macOS,
each on Node 22 and 24; its result will be recorded after execution.
Native Codex installation is checked separately. Fake host CLIs prove adapter invocation, not native Claude behavior
or live hook dispatch. The `.cmd` workaround requires a trusted native executable or Node entry path; wrappers are
never parsed or evaluated. Direct arguments avoid shell expansion but retain child process authority.


The first expanded CI run on source `e06987a` passed Linux Node 22/24 and Windows Node 22 but exposed a macOS
entry-point failure: Node resolves `/var` aliases while the old direct URL comparison did not. Copied package CLIs
silently exited without routing; invalid build commands also exited zero. A shared realpath entry check now serves
all command scripts. An executed junction/symlink-parent regression checks real routing and invalid installer exits;
the existing isolated build tests cover copied packages and refusal of invalid/missing inputs. This preserves import
behavior and package-internal symlink rejection while allowing developer repository parents to be aliased.
