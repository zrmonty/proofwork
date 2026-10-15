# Frontend design specification

## Journey continuity decisions

Load references/journey-continuity.md for navigation round trips, editor context changes or returning work. Distinguish durable work, transient presentation and derived values; use pure transition decisions with owned navigation/storage effects. Preserve relevant orientation, input and position without leaking prior-context data or inventing persistence.

Acceptance: an index/detail return retains established filters and position, while a direct detail arrival remains oriented. A late save result cannot overwrite another item's editor; account/permission changes isolate or invalidate retained data according to the real contract. Coherent type and surface choices survive the journey. Screenshots alone cannot close history, focus or work-preservation criteria; record actual interactions or gaps.

## Purpose and trigger

Design, implement, critique, or refine a frontend whose composition and interactions serve actual people and content. The skill owns design decisions and rendered critique, not installation, publication, or a universal aesthetic.

## Inputs and scope

Read the objective, audience, primary task, representative content and states, incumbent identity/components, target devices, assets/licenses, and available tools. Preserve refinement scope and user choices. Distinguish supplied facts, fixtures, predictions, and observed behavior.

## Required decisions

- Express the brief through audience, task, content priority, character, constraints, and observable acceptance.
- For substantial new composition, compare genuinely different hierarchies or navigation approaches; color swaps do not count as different directions.
- Select typography roles, rhythm, width, surfaces, image treatment, related radii, states, and responsive behavior to fit that brief.
- Prefer inviting editorial/softer forms where appropriate, while allowing distinct catalog, operations, service, and compact-tool shapes. No fixed font, radius, layout, or dependency is mandatory.
- Supply a coherent contract before parallel UI slices diverge, and review their integrated hierarchy.
- Implement meaningful loading/empty/error/success states only where the actual flow encounters them, with accessible controls, focus, recovery, reflow, and applicable motion/contrast checks.
- Critique hierarchy and task usability before surface decoration; batch fixes and compare the actual running artifact.
- Inspect meaningful action transitions and representative content stress cases, including stale selections, partial results or uncertain completion only where the real domain encounters them. Preserve actual retry and recovery contracts rather than inventing UI promises.

## Progressive disclosure

The entry point carries the brief-to-artifact workflow. references/composition.md supports direction selection, reference translation, content hierarchy and selective softness. references/interface-craft.md develops type, grouping, surfaces, assets and complete component states. references/rendered-review.md supports evidence collection and hypothesis-driven comparison. Load only the detail relevant to the task, rather than importing every reference into small corrections.

## Output and evidence

Return the brief, selected direction with reasons, current working artifact or scoped critique, shared design contract when needed, viewport/revision-bound renders, actual interactions, and resolved/outstanding findings. A screenshot cannot prove keyboard behavior; code checks cannot certify visual quality. Missing browser capability leaves rendered acceptance incomplete.

## Acceptance cases

Additional craft requirements: an actionable visual thesis, mechanism-based reference translation, a representative vertical slice before repeated sections, coherent type/surface/asset roles and complete relevant component states. Decision logic follows pure UI transitions and actual backend capabilities. Critique records a visible defect, hypothesized remedy and same-content/viewport comparison; no decorative checklist or arbitrary originality score.

Existing scenario prompts are in evals/frontend-scenarios.md. Expanded behavioral decisions:

1. A publication with a longest-title fixture chooses either lead-story/list or chronological composition for stated discovery reasons. It preserves open article reading, coherent soft media/control forms, and legible metadata. A mere accent-color change cannot resolve equal-weight hierarchy.
2. A batch-review tool favors actionable queue/status/recovery over a promotional hero. Justified repeated rows or cards receive no novelty finding.
3. Incumbent refinement preserves recognizable identity and components while correcting a specific density or focus issue. A wholesale rebrand fails scope.
4. Parallel sections share type/spacing/radius/state contracts; integrated renders reveal and resolve drift that isolated screenshots missed.
5. A filtered empty list and a network failure communicate different meanings and actions. A static essay receives no invented transactional states.
6. Missing browser access yields a bounded code/static critique with the missing checks named, never “verified desktop/mobile” from description alone.
7. A clean, coherent layout is accepted without demanding arbitrary decorative distinction.
8. A batch action retains clear target identity across filtering and partial success; copy and affordances do not imply that all operations finished or ask people to repeat successful work.
9. A longest identifier, missing image or permission-limited view is checked when representative; difficult content is not hidden or illegibly shrunk to preserve the idealized composition.
10. A generic promotional sequence hides a publication's lead: restructure around supplied content and observe hierarchy, without inventing testimonials or merely changing colors.
11. A supplied reference has a strong masthead and reading rhythm: translate those mechanisms into the project's own composition; copying identity/assets or importing the whole layout fails.
12. A rounded control family and open reading region retain contrast, focus, state distinctions and narrow readability. Extreme softness is not a substitute for hierarchy.
13. A visual correction improves a fixed viewport but regresses fallback type or intermediate-width content: keep the relevant criterion open and correct the actual defect.

## Evaluation status and authorship

Originally written to Proofwork requirements and user preferences. No external instructional assets imported or adapted. These cases define acceptance; their presence is not evidence that a browser fixture was executed. Prior broad baseline supported generic critique, not full rendered iteration. Parent evaluation records the actual checks and any pending cases separately.

## Focused design work and finish discipline

The entry point selects composition, critique/repair, visual refinement or shared-foundation work from the actual request. These are internal approaches, not extra slash commands. Refinement preserves the incumbent identity; missing design notes do not authorize a replacement. New references deepen type/color, motion/feedback and visual expression only when relevant.

Acceptance: the focused scenarios in evals/frontend-scenarios.md cover a narrow spacing fix without DESIGN.md, stronger publication identity, dark-theme/fallback defects, interruptible async feedback and findings-only critique. A default inspection/correction/confirmation pass stays bounded; further passes name an unresolved criterion or new evidence. These are authored acceptance cases until exercised in a browser fixture; package tests do not establish visual improvement.
