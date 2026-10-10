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

## Show the decision and its proof

Explain the changed behavior in one concrete sentence. List changed paths, relevant content identities, executed commands and their outcomes. Separate a measured result from an inference. For a reproduction, preserve the failing observation as well as the passing result; a new test that only passed does not show that it detects the original bug.

Example structure, with observations filled from the actual run:

```text
Status: ready-for-review
Change: export includes the last page and preserves the caller's array.
Paths: src/export.ts; tests/export.test.ts
Identity: <commit plus dirty snapshot, or relevant content digests>
Before: <regression command and observed failure>
After: <same command and observed result>
Preserved: empty input, page order and existing format checked by <evidence>.
Gap: static compiler unavailable; runtime checks do not prove type compatibility.
Next: coordinator inspect diff, run affected integrated checks and collect review.
```

Do not hide a required failure under a list of passing checks. A missing optional check can be a disclosed limitation; missing required evidence keeps the relevant criterion unresolved. Explain any deliberate tradeoff, such as a private mutable accumulator chosen for clarity, in terms of its preserved contract.

## Status has a narrow meaning

- `ready-for-review`: the worker's assigned change and available evidence are ready for inspection. It is not team completion.
- `needs-revision`: an identified defect or required change remains; name the next action and its owner.
- `blocked`: the worker cannot satisfy a necessary dependency with available authority or tools; identify the dependency and useful work already completed.

Only the coordinator records `reviewed` after accepting the integrated result. After integration changes its artifact, the coordinator revalidates the affected result on the new identity instead of relabeling old evidence. These local task statuses do not pause, complete or block a native goal.
