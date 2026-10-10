# Effects and verification

## Translate failures without disguising success

A loader returning `[]` after catching every exception makes corrupt data indistinguishable from an empty dataset. Catch the failure you can handle, translate it to the established application convention, and preserve its cause. This original adapter closes its file on both success and decode failure:

```python
import json
from pathlib import Path

class OrderLoadError(Exception):
    pass

def load_order(path: Path) -> Order:
    try:
        with path.open("r", encoding="utf-8") as source:
            value = json.load(source)
        return decode_order(value)
    except (OSError, ValueError) as error:
        raise OrderLoadError(f"Cannot load order from {path.name}") from error
```

The names `Order` and `decode_order` are defined in [Data and boundaries](data-and-boundaries.md). This adapter deliberately translates both access and invalid-data failures into one application error while retaining the cause. If callers need distinct recovery decisions, expose distinct errors instead. A filename-only message is an example choice; apply the project's disclosure policy.

Catch broad exceptions only at an actual containment boundary that reports the failure and preserves an appropriate outcome. Do not use a blanket catch merely to keep a batch loop moving. Decide whether the batch should stop, record rejected records, or return partial success before coding its exception policy. [Python exceptions](https://docs.python.org/3/tutorial/errors.html) documents exception handling and chaining.

## Resource ownership survives early exit

Use context managers for files, transactions, and supported clients. If a generator opens a resource internally, its lifetime extends into iteration; a consumer that stops early may leave cleanup until later. Prefer an explicit context owner around consumption when prompt release matters, or expose a documented closing protocol.

Do not assume writing buffered data proves durability. Use the repository's existing atomic replacement/transaction protocol where the task requires it, and test its failure path. A general helper should not silently change the persistence contract.

## Async work needs an owner

Use the repository's async model and supported interpreter. Where structured task groups are available, they can keep related work within an explicit lifetime; confirm their failure policy matches the task. A manually created task still needs an owner to await it, report its exceptions, and end it during shutdown.

Do cleanup in finally or async context managers. Do not suppress cancellation without a specific API requirement and a documented continuation policy. Cancellation stops a local await according to the involved API; it does not prove a remote write never happened. A retry after timeout must consider an unknown outcome.

Test cancellation during the stage that holds a resource or performs an effect, then inspect cleanup and partial state. Testing only normal completion proves neither. [Asyncio task documentation](https://docs.python.org/3/library/asyncio-task.html) explains task ownership, structured concurrency, and cancellation mechanisms; inspect documentation appropriate to the project's interpreter.

## Subprocesses are trust boundaries

Prefer argument lists and checked results to interpolated shell commands. Also distinguish arguments from options: shell avoidance alone does not stop an external program interpreting an input beginning with a dash as an option. Use its documented option terminator or other safe contract where relevant.

Select a timeout and output policy from the operation, rather than buffering unlimited output from a large process by default. Preserve exit code and useful sanitized diagnostics. Do not log credentials, sensitive arguments, or entire input payloads. On Windows, confirm the actual executable and batch-file behavior before making a shell-safety claim. [Subprocess documentation](https://docs.python.org/3/library/subprocess.html) supplies platform-specific behavior.

## Checks should challenge promises

- Decoder: malformed shape, valid limits, booleans/floats at integer boundaries, and original input preservation.
- Mutable data: two independent calls, nested aliasing, and returned-value edits consistent with documented ownership.
- Iterator: one-shot input and early termination when consumption/resource lifetime changes.
- Loader: valid data, invalid JSON/domain data, missing file, error cause, and cleanup.
- Async/process: failure, cancellation/timeout, shutdown, and relevant partial effects.
- Public interface: an affected consumer, configured type checks, and import/runtime compatibility.

Use existing tooling and the supported interpreter. Report actual checks and gaps separately. A passing snippet on one interpreter is not evidence for every supported version or for a full application integration.
