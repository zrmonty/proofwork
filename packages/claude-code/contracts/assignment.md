# Assignment

The coordinator provides this record before dispatch. Missing ownership or acceptance information is resolved before writes.

```text
runId / taskId / role:
objective / acceptance criteria:
repository / allowed checkout / base revision:
owned files or modules / forbidden shared outputs:
dependencies / agreed interfaces:
selected skill paths / playbook:
checks and observable behaviors:
available tools / requested and actual model when known:
authorization / constraints / limits:
result location / coordinator contact:
```

Workers explicitly read worker-mode and the selected skill files; inherited chat context is insufficient. Shared contract changes return to the coordinator before implementation. Reviewers are read-only unless their assignment explicitly authorizes edits. No nested dispatch unless the coordinator grants bounded ownership and capacity.

## Make ownership executable

Name the checkout and owned paths, rather than saying "handle the backend." If two assignments change the same schema, lockfile, generated directory or shared component, settle that dependency before dispatch. A directory assignment owns its descendants. A read-only reviewer can inspect those files without becoming a writer.

For a small task, a short message can supply the contract. For parallel implementation, record enough detail that a fresh worker can proceed without reconstructing the conversation:

```text
Task: export-last-page; role: implementer
Checkout: <absolute target repository>; base: <recorded content identity>
Own: src/export.ts, tests/export.test.ts
Goal: export every supplied page in input order, including a one-page document.
Preserve: caller array and existing file format; do not change unrelated options.
Dependency: shared/config.ts belongs to another worker; report required changes.
Read: <installed package>/skills/worker-mode/SKILL.md and selected skills.
Check: reproduce omission; test empty, one-page and multi-page inputs.
Return: changed paths, content identity, observed commands and unresolved gaps.
Do not: edit generated packages, aggregate state, commit or publish.
```

The coordinator imports a CLI assignment separately. Its required fields are `id`, `objective`, `files`, and `revision`; additional contract detail can be recorded alongside them. The tool does not dispatch an agent or grant permission. See the [tool schemas](../scripts/README.md).

## Change the assignment before changing the scope

If the fix needs an unowned path, return the specific dependency and the smallest proposed adjustment. The coordinator can transfer ownership after collecting the current owner, sequence the change, or isolate an alternative. Do not treat a worker's reviewed status as proof that its process has stopped. Reopening a reviewed task must reacquire uncontested ownership.

Acceptance describes observable behavior. "Make it cleaner" is too vague for implementation ownership; "remove duplicate parsing while preserving malformed-input errors" gives both a target and a preservation check. Avoid assigning implementation and final acceptance to the same worker when independent review is required.
