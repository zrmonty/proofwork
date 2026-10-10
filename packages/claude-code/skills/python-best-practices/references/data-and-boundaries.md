# Data and boundaries

## Decode an order without trusting its annotation

Dataclasses and annotations do not validate external data. Define shape, ranges and ownership explicitly:

```python
from dataclasses import dataclass
from typing import TypeGuard

@dataclass(frozen=True)
class Order:
    sku: str
    quantity: int

def is_object_dict(value: object) -> TypeGuard[dict[object, object]]:
    return isinstance(value, dict)

def decode_order(value: object) -> Order:
    if not is_object_dict(value):
        raise ValueError("order must be an object")
    sku = value.get("sku")
    quantity = value.get("quantity")
    if not isinstance(sku, str) or not sku.strip():
        raise ValueError("sku must be a nonempty string")
    if type(quantity) is not int or not 1 <= quantity <= 100:
        raise ValueError("quantity must be an integer from 1 through 100")
    return Order(sku=sku, quantity=quantity)
```

This contract accepts extra keys and preserves SKU spelling, including surrounding whitespace; normalization should be an explicit product decision. It rejects booleans as quantities, and `0`, `101`, floats, and strings. The exact integer check is intentional at this wire boundary; do not use exact type tests universally when subclasses are valid inputs.

The guard establishes only a dictionary with arbitrary object keys/values. Field checks then narrow actual values; it does not pretend the input already has an order schema. Use the supported interpreter's typing facilities or existing compatibility imports. Prefer `object` at unknown boundaries, `TypedDict` for an already validated dictionary contract, and a small `Protocol` for behavior the consumer actually requires. Do not cast decoded data to a domain record or use `Any` to bypass narrowing.

The frozen record contains only immutable scalar fields. Adding a list later changes that ownership story: frozen construction does not freeze the list. [Dataclass documentation](https://docs.python.org/3/library/dataclasses.html) describes the generated behavior, not a runtime schema guarantee.

Read JSON using the existing adapter, then call the decoder. JSON parsing and domain rejection are distinct failures; preserve that distinction when useful to callers. For numeric data, choose integer units or the project's decimal representation when precision matters. If non-finite values are invalid, validate them explicitly; serialization success is not evidence of domain validity. [Python's JSON documentation](https://docs.python.org/3/library/json.html) covers the module's supported representations and parsing behavior.

## Copy the changed path, not every object

Consider a nested list of batches. `copied = list(batches); copied[0].append(order)` still modifies the original first batch. If the operation promises to preserve input, reconstruct that changed path:

```python
from collections.abc import Sequence

def append_to_first(
    batches: Sequence[Sequence[Order]], order: Order
) -> list[list[Order]]:
    if not batches:
        return [[order]]
    return [[*batches[0], order], *[list(batch) for batch in batches[1:]]]
```

Here every returned batch list is independent. Order instances remain shared, which is valid for the immutable scalar record above. Test both original preservation and the ownership promised for later edits to returned lists. Do not use blanket deep copying when the changed path and value ownership can be stated simply.

sorted produces a new list; sort mutates in place. Choose by ownership; private builders may preserve caller data.

## Defaults and iteration change behavior

Use `None` and create a fresh list inside a function instead of a mutable default shared across calls. Use a dataclass default factory for per-instance mutable data when that data is actually needed. Avoid returning a mutable global cache as though it were an independent value.

An iterator may be consumed exactly once. If code first counts it and then transforms it, the second pass can be empty. Either use one traversal, require a reusable sequence, or materialize once when the size is appropriate. The choice belongs in the interface, not in a surprise conversion hidden deep in a helper.

For very large input, materialization has a real cost. Preserve streaming when the contract allows it, and make the timing of errors and resource ownership visible to the consumer.

## Parsing policy and interoperable values

Python's standard JSON decoder accepts non-finite constants and repeated object names by default; repeated names retain the last value. Successful decoding therefore does not establish a strict interoperable document. When the protocol requires rejection, configure its existing adapter deliberately: `parse_constant` can reject non-finite constants, `object_pairs_hook` can detect duplicate names, and `allow_nan=False` prevents emitting non-finite floats. Do not impose duplicate rejection on a legacy protocol without checking its compatibility requirements. Bound untrusted document size at the transport boundary before parsing. See [JSON interoperability behavior](https://docs.python.org/3/library/json.html#standard-compliance-and-interoperability).

Arbitrary-size Python integers may not survive a JavaScript consumer's numeric representation; preserve the agreed wire representation for large IDs. Constructing `Decimal` from a binary float carries that float's approximation: use the source decimal text or existing exact representation when that is the contract. Decide rounding and units at the domain boundary rather than changing a process-wide decimal context inside a helper.

Treat naive local datetimes, offset-aware instants and calendar dates as different inputs. Do not silently attach a timezone to repair an ambiguous value. Establish the actual source timezone and daylight-saving policy when conversion affects scheduling; keep the application's existing timezone facilities.
