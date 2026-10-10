---
name: frontend-design
description: "Use for frontend design, implementation, critique, and refinement; produce content-specific inviting interfaces with rendered and interaction evidence."
---

# Frontend design

## Inputs
Identify the people using the page, their next action, actual content/states, incumbent identity/components, target devices, assets and licenses, and available browser tools. Separate supplied facts from labeled fixtures; do not invent testimonials or business claims.

## Workflow
1. Write a short brief tying the user task to content priority and constraints. For substantial new designs, explore two genuinely different compositions before choosing. Lightweight sketches suffice; user-delegated choice requires reasons, not an approval stop.
2. Choose hierarchy, type and reading rhythm, layout, density, palette/contrast, image treatment, radius system, and purposeful motion. Record the direction in existing project documentation or DESIGN.md. Each choice must serve this brief.
3. Start with the user's inviting editorial preference when compatible with the product. Let real headlines, excerpts, bylines, images, and article structure determine composition. Give the publication its own identity rather than reproducing Substack.
4. Use softer controls/media/panels with coherent nested radii. Explore compact controls around 8-12px, media/surfaces 12-20px, and prominent panels 20-28px only if they suit this design. Leave reading regions open. Do not turn the page into nested rounded boxes.
5. Establish one or two distinctive choices and carry them through the site. Handle long headlines, missing images, real metadata, and narrow views. Use licensed fonts and fallbacks; a serif headline is an option, not a recipe.
6. Before parallel UI work, one design owner supplies common tokens, component contracts, content states, and a representative composition. Assign disjoint ownership; inspect the combined interface for drift.
7. Implement using incumbent components. Include semantic controls, keyboard navigation, visible focus, sufficient contrast, reflow, reduced motion, and required loading/empty/error/success states. Use familiar affordances for important actions.
8. Inspect the running primary page, a representative detail, and a narrow mobile view. Exercise the primary flow, keyboard path, and relevant failures. Capture revision-bound screenshots and interaction results.
9. Identify the few material visual/usability weaknesses, batch improvements, and compare before/after renders. A weak hierarchy needs a hierarchy fix. Color changes alone cannot resolve it.
10. Obtain independent visual review for substantial work. Finish when direction, content, required states, and interactions meet the brief and material findings are resolved. Preserve honest incomplete status when browser evidence is unavailable.

## Outputs
A brief, selected direction and reasons, working interface or scoped critique, shared design contract when parallel, desktop/mobile captures, interaction/check evidence, visual findings and resolution, and remaining preference questions.

## Boundaries
Refinement preserves incumbent identity unless redesign is authorized. Repeated cards, gradients, and standard layouts require reasons; they are not automatically defects. Do not invent assets, introduce a design dependency for convenience, or endlessly polish without a new hypothesis. Code checks cannot establish visual quality, and appearance cannot establish correctness.

## Review questions
Can a reader tell what this specific product/publication is? Does real content determine hierarchy? Are rounded treatments coherent and controls clear? Does mobile preserve priority? Can a keyboard user complete the task? Name concrete defects and remedies; avoid beauty scores or claims to objectively detect AI authorship.

## References
Use [WCAG 2.2 guidance](https://www.w3.org/WAI/WCAG22/quickref/) for applicable access checks and project/browser standards for implementation. Substack is a user preference reference only. This workflow and text are original Proofwork requirements.

## Behavioral cases
An editorial index and article detail stay readable with long headlines; a task-led uploader gets its own composition; refinement keeps identity; inconsistent parallel tokens are reconciled; no browser means incomplete visual verification. See frontend-scenarios.
