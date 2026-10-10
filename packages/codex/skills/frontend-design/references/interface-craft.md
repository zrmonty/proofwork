# Interface craft

Load this reference when a visual direction is chosen but the implementation still feels unresolved. Use the actual components and content; these are diagnostic decisions, not a fixed style kit.

## Type at the scale people use

Inspect the headline, paragraph, metadata, label, button and dense-value roles together. Choose a readable body and a deliberate hierarchy before adding another family. Weight, line height and measure work as relationships: a large heading with tightly packed metadata can still feel congested. Tune wrapping with the actual longest supplied title; do not insert hard line breaks merely to make one viewport look ideal.

For sustained reading, inspect full paragraphs, subheads, links, lists and captions. Keep an appropriate reading measure and comfortable line spacing, testing the project's text and fallback font rather than copying a universal pixel recipe. A narrow title can be expressive while body text remains calm. Secondary does not mean tiny or faint.

For forms and tables, align labels and values by meaning. Keep units and currency visible, and use suitable numeric alignment when comparison matters. Do not truncate the only distinguishing part of an identifier or shrink text until a dense layout fits. Establish wrapping, disclosure or an alternate arrangement based on the person's task.

Respect text zoom, localization, bidirectional/long scripts when in scope, and platform font differences. Validate actual font loading and fallback. Avoid unexplained letterspacing, artificial casing or unsupported weights; font synthesis and missing glyphs can change the intended voice.

## Compose a page, not a pile of components

Define which visual edge or axis organizes the view. Align related content, but allow deliberate optical adjustment where a logo, icon or display letter appears off-center despite equal geometry. Explain an exception through the visible result rather than accumulating arbitrary offsets.

Use grouping to show relationships: title with its description, label with its field, error with its action, media with its caption. Compare within-group and between-group spacing. If unrelated sections feel joined, fix their spacing or structure before drawing another box. If a card contains several nested panels, establish whether each boundary carries meaning.

Control density deliberately. A reading page can breathe; a work queue should expose enough items to support decisions. Large empty areas are useful when they clarify emphasis, but a blank hero that hides the task is waste. At narrow widths, preserve the priority and relationships, not the desktop silhouette.

Use asymmetry where it makes hierarchy clearer: a lead story beside a restrained list, a narrow control rail beside a wide workspace, or a quiet caption offset against dominant media. A symmetrical grid can be correct for equal-value comparisons. Do not introduce asymmetry merely as an originality signal.

## Color, surfaces and softness

Give colors roles: text, muted text, surface, divider, accent, focus and semantic feedback. Determine which role draws attention before assigning colors. An accent used on every panel no longer distinguishes the primary action. Convey status through wording or shape as well as color.

Relate border, shadow and background decisions to depth or grouping. One surface should not need a border, heavy shadow, blur and gradient unless their combined job is observable. A subdued canvas with warm text and a restrained accent can support an editorial direction, but respect actual contrast and incumbent identity. Texture or gradients need a content/brand purpose and usable fallback.

Use rounded forms to make useful controls and media inviting. Review large and small components together: the same radius can look soft on a small control and barely visible on a broad panel. Nested corners should fit their padding and optical relationship; do not stack pill-shaped containers around every field. Reading regions often benefit from an open canvas with selective media containment.

Inspect hover, focus, selected, pending, invalid and disabled treatments on the same surface. They must remain distinguishable without relying on tiny opacity differences. Keep focus visible when shadows, clipping and sticky elements are present. Decorative layering must not intercept input or obscure reading.

## Assets that belong to the content

Inventory supplied imagery, logos, icons and their actual permitted use. Choose an image for what it communicates, not to occupy a blank rectangle. Match crop, focal point, aspect and captions across related surfaces. Test missing/slow assets and the narrow crop; a face, diagram or product detail may lose its meaning when centered mechanically.

Use original or permitted assets when needed. Generated decorative imagery must not masquerade as documentary evidence, a real customer, a testimonial or an actual product screenshot. Record provenance and meaningful placeholders. A typography-led page may be stronger without an image than with an irrelevant stock substitute.

Keep icons coherent in stroke/weight, sizing and meaning; one established set is usually enough. Labels must still communicate unfamiliar or consequential actions. Render charts and product/data diagrams from actual supplied facts rather than inventing numbers to improve a composition.

## Components as complete interactions

Design the state family together. A field includes its label, value, help, invalid state and recovery where needed. A selectable row includes identity, selected state and consequences. A dialog needs initial focus, keyboard behavior, completion/cancel paths and return focus, following the project's established accessible mechanism. A tooltip cannot hold information needed to complete an action.

Use clear feedback at the action's location without disrupting the entire page for a small update. Motion can reveal continuity, expansion or progress; it must not conceal delay or imply success before confirmation. Preserve reduced-motion behavior and usable static states. Check responsiveness and focus when content inserts, disappears or reorders.

Avoid adding interaction merely to animate a static surface. Hover effects should not shift neighboring layout or make touch-only tasks depend on hover. Sticky headers/controls must earn their space and avoid covering focused content or recovery messages. Loading arrangements should reserve sensible space without inventing progress data.

## Carry the direction through implementation

Reuse tokens and primitives already in the project. Add only the roles needed by the chosen design. Remove superseded overrides and check unused styles, selectors and assets with their actual dynamic consumers before deletion.

Check image sizing, font loading, expensive effects and layout shifts against representative devices and existing tools when performance matters. A screenshot cannot establish responsiveness or runtime cost. Do not replace semantic elements with styled generic containers or ship inaccessible controls to match a comp.
