# Commit features specification

Purpose: every newly authored outgoing GitHub commit names major and minor changes without inventing features or implying release compatibility.

Inputs: staged diff, repository conventions, actual check results, outgoing range, authorized destination.
Output: a truthful commit with Major features and Minor features sections, plus validation and limitations.
Boundary: no automatic history rewriting, global hook installation, unrelated staging, or new publication permission.

Acceptance: reject a message missing either section or leaving it empty; accept None and real change descriptions; preserve project subject conventions; fail closed on invalid Git ranges. A documentation-only scenario uses Major features None. A breaking change is described explicitly without deriving a version bump from the category. Message verification does not imply behavior verification.

Original authorship: written from the user's commit-format requirement; no existing skill imported or adapted.
