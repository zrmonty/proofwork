---
name: python-best-practices
description: "Use for Python implementation or review; make dependencies, mutation, resource lifetime, and error contracts explicit."
---

# Python best practices

## Inputs
Inspect supported Python versions, project configuration, caller expectations, package dependencies, and the existing test/lint/type-check commands.

## Workflow
1. Give meaningful interfaces accurate annotations. Choose a value record, dataclass, or enum when it clarifies a real contract; retain simple built-in structures where their meaning is already clear.
2. Put calculations and validation rules in deterministic functions with supplied dependencies. Avoid global state and mutable default arguments. Check aliasing before sorting, extending, or editing caller collections.
3. Remember that frozen records do not recursively freeze nested objects. Copy or model ownership only where needed, and test the preservation actually promised.
4. Catch failures where the code can handle them. Use specific exception classes and retain causes when translating errors. Do not return an empty success value after an unexplained failure.
5. Use context managers for files and other resources. For async work, preserve cancellation and run cleanup on failure. Iterator consumption and generator resource lifetimes need explicit ownership.
6. Validate serialization and subprocess inputs at entry. Avoid shell interpolation of untrusted text; prefer argument lists and check the process result. Test missing, malformed, and boundary data.
7. Run configured checks and behavior tests with the project's interpreter. Exercise repeated calls, mutation hazards, resource cleanup, and actual I/O contracts when touched.

## Outputs
Report changed data/error contracts, interpreter/check results, mutation ownership, and any missing runtime evidence.

## Boundaries
Annotations are not runtime validation. Do not add a type checker, framework, packaging system, or immutable-data dependency for this skill. Load functional-programming for substantial state design.

## References
- [Dataclasses](https://docs.python.org/3/library/dataclasses.html)
- [Errors and exceptions](https://docs.python.org/3/tutorial/errors.html)
- [Async tasks and cancellation](https://docs.python.org/3/library/asyncio-task.html)
- [Subprocess](https://docs.python.org/3/library/subprocess.html)

## Behavioral cases
Two calls do not share default state; nested input is preserved where promised; failed loading closes the file; subprocess failure is visible. See language-scenarios.
