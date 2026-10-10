# Host and environment parity — 0.35.0

Scope: install invocation, routing paths and evidence execution, with no global PATH/model/permission changes.

Executed fixtures use temporary directories with spaces and Unicode. Both host installer adapters execute a fake
Node CLI with literal source arguments. Evidence checks preserve metacharacters and empty arguments, record exits
0 and 7, fail on timeout, and surface missing executable errors. The full evidence CLI path rejects conflicting
modes and malformed argv before spawning, then records a successful observation against the checkpoint identity.
Windows-style policy paths select the same rules as Unix paths without changing caller input. Claude source-folder
version tests distinguish the loaded folder from a cached install and reject unknown loaded versions.

CI expands to Windows, Ubuntu and macOS, each on Node 22 and 24. Results will be recorded after execution.
Native Codex installation is checked separately. Fake host CLIs prove adapter invocation, not native Claude behavior
or live hook dispatch. The `.cmd` workaround requires a trusted native executable or Node entry path; wrappers are
never parsed or evaluated. Direct arguments avoid shell expansion but retain child process authority.
