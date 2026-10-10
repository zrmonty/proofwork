# Preserve contracts

Use when: Changing supported behavior, interfaces or ownership.

Trace consumers and preserve data shapes, errors, cleanup and caller mutation semantics. Match the dominant style. A requested breaking change needs its actual caller and migration scope; a smaller implementation does not excuse a lost guarantee.

Check representative consumers and the changed failure boundary. Trace-path and impact-map own discovery; language skills own implementation details.
