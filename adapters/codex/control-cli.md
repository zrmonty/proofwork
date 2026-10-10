# CLI verification

## Commands and processes

Use available shell/process tools in the target checkout. Read project instructions and use its existing commands. Record the command, working directory, environment/toolchain, exit status and observed output against the integrated content identity. Poll long-running processes through their actual session handles. Preserve useful bounded logs; exclude secrets. A command's exit status supports the behavior it actually checks, not the entire objective.

## Interactive verification and cleanup

A TUI requires interactive terminal input and observable output; ordinary command execution does not certify that capability. If the host lacks it, report interactive verification as incomplete. On Windows, use one shell for path operations, verify absolute targets before recursive cleanup, and never assemble destructive commands across shells. Do not kill unrelated processes or discard uncommitted work.


Prefer evidence `--argv JSON_FILE` for executable-plus-argument checks across operating systems. Preserve arguments
as strings; use an absolute executable when PATH differs. Use `--command` only when shell syntax is required.
Both inherit operator authority and deadlines. A failed spawn or timeout is a gap, never a successful check.
