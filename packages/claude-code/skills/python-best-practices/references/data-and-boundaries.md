# Data and boundaries

## Decode an order without trusting its annotation

`Order(**json.loads(text))` can be convenient, but a dataclass constructor and annotations alone do not enforce domain rules. An external order needs decisions about shape, booleans, ranges, extra fields, and record ownership. This original example declares a small contract without adding a validator dependency:

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Order:
    sku: str
    quantity: int

def decode_order(value: object) -> Order:
    if not isinstance(value, dict):
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

For ordering alone, `sorted(items, key=...)` produces a new list whereas `items.sort()` changes a list in place. Choose from the ownership contract rather than a blanket ban on mutation. A private builder is fine if it does not escape before completion or modify caller data.

## Defaults and iteration change behavior

Use `None` and create a fresh list inside a function instead of a mutable default shared across calls. Use a dataclass default factory for per-instance mutable data when that data is actually needed. Avoid returning a mutable global cache as though it were an independent value.

An iterator may be consumed exactly once. If code first counts it and then transforms it, the second pass can be empty. Either use one traversal, require a reusable sequence, or materialize once when the size is appropriate. The choice belongs in the interface, not in a surprise conversion hidden deep in a helper.

For very large input, materialization has a real cost. Preserve streaming when the contract allows it, and make the timing of errors and resource ownership visible to the consumer.
