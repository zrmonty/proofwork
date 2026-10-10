# Rendered review

Use the actual running artifact. A static mock supports composition review; it cannot prove the implementation's responsive behavior, focus, navigation, or error recovery.

## Evidence proportional to the claim

For a narrow visual correction, compare the affected region before and after at the viewport that exposed the defect. For a substantial build, capture the primary view, a representative detail/state, and a narrow view with realistic content. Add captures only when they answer a distinct question; a screenshot collection without observations is not evidence.

Record artifact/revision identity, viewport dimensions, route/state, fixture content, and the action performed. Use sanitized examples. Distinguish observed behavior from predictions and from subjective preferences. If assets, network responses, or fonts are missing, report how that limits the review instead of certifying the intended design.

## A useful critique pass

1. **Orient:** Can a first-time visitor identify the product, current location, and next meaningful action from the first useful view?
2. **Scan:** Does visual weight match content priority? Are unrelated regions competing? Can the eye follow the intended reading order?
3. **Read:** Check actual headline wrapping, paragraphs, metadata, link distinction, and dense values. Inspect contrast through the project's tools and target, not appearance alone.
4. **Act:** Exercise the primary flow with keyboard and pointer. Inspect focus order/visibility, labels, feedback, retained input, and recovery from a relevant failure.
5. **Reflow:** Inspect the narrow layout and relevant zoom/reflow. Check clipping, accidental horizontal scroll, action access, image crop, and table/list meaning.
6. **Polish:** Look for inconsistent spacing, baselines, radii, icon weight, and media treatment after the hierarchy and interaction work.

Apply the portions relevant to the brief. A static essay need not be tested as a transactional application; an upload console needs more than a homepage capture.

## Findings that lead to changes

Weak: “Make it more premium.”

Useful: “The index gives all twelve stories the same image size and title weight, so the lead essay is indistinguishable. Give the lead a distinct composition and reduce secondary image emphasis; compare scanning on desktop and narrow view.”

Weak: “Add more rounded corners.”

Useful: “The rounded image and square floating control use unrelated corner treatments, and the control appears detached. Align their radius roles and spacing, then check focus is still visible.”

Weak: “Mobile looks good.”

Useful: “At the recorded narrow viewport, the longest supplied headline wraps without clipping, the byline remains readable, and opening the essay works by keyboard. The payment flow was not exercised.”

Prioritize material findings and batch related fixes. Repeat the same capture and action after changes. Stop when acceptance is met and remaining differences are preference or out of scope. A clean layout may have no finding; review is not a requirement to redesign.
