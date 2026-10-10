# Trace path details

Build a usable mental model for the user's question from inspected code. Start with the named action, entrypoint or subsystem; search symbols and callers before reading surrounding modules. Follow one representative success path and the failure or cancellation path that changes the explanation. Widen scope only when an unresolved edge requires it.

Identify control flow, transformations, validation, effect boundaries and where authority or ownership changes. Name the owner of mutable state and distinguish references, copies and persisted records. Inspect actual configuration and dispatch registration where they select the path; a matching function name does not establish reachability.

Return a short path map with concrete file/symbol pointers and arrows showing responsibility changes. Explain what invokes each step, what data it receives and what observable result leaves it. Highlight the smallest set of invariants the reader needs to predict behavior. Separate inspected behavior, executed observations and inference; identify unresolved dynamic dispatch or external service contracts.

Remain read-only unless changes are authorized. Existing safe checks may confirm a disputed edge; do not send real messages, modify data or expose configuration values to explain a path. Stop when the requested mechanism is understandable, rather than inventorying the repository. Use origin-check for historical rationale and impact-map for proposed changes.
