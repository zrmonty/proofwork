# Specification: impact-map

Predict consequences of a proposed change by tracing demonstrated consumers, registrations and data contracts. Output prioritized impacts with pointers, supporting evidence and checks of actual consumer boundaries. Include compatibility and mutable/effect ownership where applicable; bounded searches must disclose their limits.

Acceptance cases:

1. A serializer change includes persisted records and retained clients, not only direct imports.
2. A dynamically registered handler's configuration is checked before concluding it has no callers.
3. A migration identifies old/new version compatibility and distinguishes application rollback from data repair.
4. A consumer without an executable environment remains an explicit verification gap; analysis does not trigger deployment.

These are instructional acceptance cases, not executed evaluations.
