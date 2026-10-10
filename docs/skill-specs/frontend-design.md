# Frontend design specification

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

## Progressive disclosure

The entry point carries the brief-to-artifact workflow. references/composition.md supports choosing structure, typography, rhythm, and selective softness. references/rendered-review.md supports evidence collection and actionable visual findings. Load them when those decisions matter, rather than importing both into every small correction.

## Output and evidence

Return the brief, selected direction with reasons, current working artifact or scoped critique, shared design contract when needed, viewport/revision-bound renders, actual interactions, and resolved/outstanding findings. A screenshot cannot prove keyboard behavior; code checks cannot certify visual quality. Missing browser capability leaves rendered acceptance incomplete.

## Acceptance cases

Existing scenario prompts are in evals/frontend-scenarios.md. Expanded behavioral decisions:

1. A publication with a longest-title fixture chooses either lead-story/list or chronological composition for stated discovery reasons. It preserves open article reading, coherent soft media/control forms, and legible metadata. A mere accent-color change cannot resolve equal-weight hierarchy.
2. A batch-review tool favors actionable queue/status/recovery over a promotional hero. Justified repeated rows or cards receive no novelty finding.
3. Incumbent refinement preserves recognizable identity and components while correcting a specific density or focus issue. A wholesale rebrand fails scope.
4. Parallel sections share type/spacing/radius/state contracts; integrated renders reveal and resolve drift that isolated screenshots missed.
5. A filtered empty list and a network failure communicate different meanings and actions. A static essay receives no invented transactional states.
6. Missing browser access yields a bounded code/static critique with the missing checks named, never “verified desktop/mobile” from description alone.
7. A clean, coherent layout is accepted without demanding arbitrary decorative distinction.

## Evaluation status and authorship

Originally written to Proofwork requirements and user preferences. No external instructional assets imported or adapted. These cases define acceptance; their presence is not evidence that a browser fixture was executed. Prior broad baseline supported generic critique, not full rendered iteration. Parent evaluation records the actual checks and any pending cases separately.
