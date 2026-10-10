# Worker result

Return a reviewable artifact rather than a success assertion.

```text
runId / taskId:
status: ready-for-review | needs-revision | blocked
revision or content digests / checkout:
changed files / fulfilled criteria:
checks actually executed / evidence paths:
findings / justified design departures:
remaining gaps / next action:
requested and actual model, or unknown:
```

The coordinator inspects the artifact and integrated checks. Workers do not declare the team complete or update aggregate run state. A missing tool, failed test, or inability to access another owner's files is reported precisely; unrelated assigned work can continue.
