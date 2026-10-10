# Refactor

Name the concrete structural problem and behavior that must survive. Capture representative behavior first. Compare a simpler ownership or data model with local cleanup; choose a change that removes demonstrated complexity. Include callers, exports, fixtures and error paths in scope. Preserve externally observable ordering, validation, compatibility and resource behavior. Verify the combined artifact, measure the resulting simplification, and obtain maintainability review. Avoid incidental dependency or tooling changes.
