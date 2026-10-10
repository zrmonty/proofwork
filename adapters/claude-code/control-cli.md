# CLI verification

## Commands and processes

Use Claude's available shell/process tools and the project's existing check commands. Record working directory, environment/toolchain, command, exit status and observed output against the verified content identity. Capture bounded logs without credentials. A passing command proves only the behavior exercised. Monitor long-running tools through the host's returned process/session interface and stop only task-owned processes.

## Interactive verification and cleanup

Interactive TUI control requires observable terminal state and supported input; do not declare it from shell availability. Missing interactive tools leave that criterion unverified. Resolve and validate destructive cleanup targets before acting, preserve unrelated files, and follow platform-native path handling.


Prefer evidence `--argv JSON_FILE` for executable-plus-argument checks across operating systems. Preserve arguments
as strings; use an absolute executable when PATH differs. Use `--command` only when shell syntax is required.
Both inherit operator authority and deadlines. A failed spawn or timeout is a gap, never a successful check.
