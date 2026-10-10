---
name: frontend-design
description: Design, implement, or refine frontends through content-specific composition, coherent visual decisions, accessible interaction, and rendered critique.
---

# Frontend design

Make the interface feel made for its people, content, and task. A distinctive page has a clear point of view; every region does not need its own visual trick. Prefer an inviting editorial direction and softer forms where they suit the product. Preserve the user's identity and incumbent design when the assignment is refinement.

## Find the design problem

Read the actual content, existing components, primary flow, and target devices before choosing a layout. Identify who arrives, what they need to understand, and what they should do next. Separate supplied facts from fixtures. Do not invent customers, awards, testimonials, metrics, or asset licenses.

Write a brief that can settle a disagreement: audience; primary task; content priority; desired character; constraints; and observable acceptance. “Warm” is a direction, not an acceptance criterion. “A reader can scan the index, identify the lead essay, and open it on a narrow screen without clipped titles” is assessable. For a small existing-page correction, a paragraph and a focused render comparison suffice.

For a substantial new composition, compare two plausible directions that change information hierarchy or navigation. Two palettes on the same arrangement are one direction. Read [composition and visual decisions](references/composition.md) when selecting a new direction or diagnosing a generic layout. Choose within delegated authority and explain why; do not create an approval stop merely to show options.

## Give the interface a coherent voice

Read [humanizer](../humanizer/SKILL.md) when creating or revising visible wording and content structure. Keep the language specific to the audience and actual product behavior. Reduce repeated title layers and promotional chrome when they add no useful orientation; preserve meaningful headings, navigation, accessible structure and required links. Review ordinary and failure-state copy as part of the real flow.

Choose the hierarchy first: dominant content, supporting content, navigation, and action. Give these roles different visual weight through scale, spacing, placement, and contrast. If everything is prominent, nothing leads. Use real long titles, meaningful metadata, and representative imagery while composing; short placeholder text hides the hard cases.

Record the chosen direction in the existing design document or a concise `DESIGN.md`. Include type roles and fallbacks; spacing rhythm; content widths; surfaces and colors; control and media radii; image treatment; interaction states; responsive changes; and one or two distinctive decisions. Reuse the project's system before introducing fonts, icons, packages, or additional token layers. Do not invent a design system for a one-line repair.

Use softness selectively. Controls, media, and bounded surfaces can have related rounded forms while long reading regions remain open. Relate nested radii to padding and inspect the corners at their actual size. A pill is useful for a tag or compact action; it is not the default shape for every control. Do not cover weak hierarchy with oversized radii, blur, shadows, or gradients.

For parallel UI work, the design owner supplies a shared contract before separate slices diverge: selected direction, representative composition, tokens, component states, content fixtures, responsive behavior, and ownership. Integrate and inspect the whole page. Two individually polished sections can still compete for attention or disagree on density.

## Build the real experience

Use semantic controls and familiar affordances for important actions. Make the primary flow work with keyboard and pointer; expose focus; keep labels and errors connected to their controls; preserve meaningful reading order. Apply the project's accessibility target and check applicable contrast, reflow, motion, and target requirements against its standards. A screenshot cannot establish keyboard behavior.

Design the states that the flow actually encounters: loading, empty, failed, partial, successful, disabled, or destructive confirmation as appropriate. Put recovery near the failed action and preserve entered work when possible. Distinguish “no items exist” from “the filter matches no items” and “items failed to load.” Do not add fictional loading or error screens to a static publication merely to fill a checklist.

Treat responsiveness as a change of priorities and available space, not scaled-down desktop styling. Decide what stacks, what changes alignment, how actions remain reachable, and whether dense data needs a useful alternate view. Check long text, missing media, realistic row counts, and zoom/reflow where relevant. Make motion explain a state change; support reduced motion and avoid delaying essential interaction for decoration.

## Render, critique, and improve

Read [rendered review](references/rendered-review.md) for substantial builds, redesigns, or visual audits. Inspect the running primary page, a representative detail or state, and a narrow viewport. Exercise the primary action, keyboard path, and relevant failure recovery. Record viewport, artifact/revision identity, and observed outcome with captures.

Critique in order: purpose and hierarchy; reading order and density; alignment and rhythm; interaction and state clarity; typography and media; surface detail. Name a visible defect, its effect on the person, and the smallest design change that resolves it. “Looks generic” is a prompt to investigate, not a finding. A uniform card wall may flatten editorial priority; repeated cards may correctly support a product catalog.

Batch the few material changes, render again, and compare at the same viewports. A stronger hierarchy should be visible in composition and reading order, not merely asserted in a description. Preserve behavior while polishing. Use independent visual review for substantial work when available and authorized; resolve material findings without demanding novelty from already effective patterns.

## Deliverable and finish line

Return the brief and chosen direction, working interface or scoped critique, shared contract when needed, rendered/interaction evidence, and resolved or outstanding material findings. Finish when the real content and required states meet the brief, desktop and narrow layouts preserve priority, and the primary flow works through its relevant inputs and recovery paths.

If browser or interaction tooling is unavailable, report the bounded artifact and the missing checks. Code review can support likely correctness; it cannot certify visual quality or access. Do not continue cosmetic iteration without a concrete hypothesis, and do not substitute a subjective beauty score for observable evidence.
