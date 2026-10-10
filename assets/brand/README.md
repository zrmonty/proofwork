# Proofwork brand assets

- `proofwork-logo.png`: the approved full logo, including the wordmark, on a transparent background.
- `proofwork-icon.png`: the icon-only variant for square plugin listing and composer surfaces.
- `proofwork-logo-dark.png`: off-white full logo with the amber check on a charcoal background.
- `proofwork-icon-dark.png`: the matching square icon for dark plugin surfaces.

Both images were created with the built-in image-generation tool. The icon edit used the approved full logo as
its reference: remove the wordmark, retain the rounded navy P and amber check, center the mark on a square
transparent canvas, and add no text, border or background.

Dark variants were edited with the same built-in tool: preserve the approved composition, recolor navy to
off-white, retain the amber check and render clean contours on a solid charcoal background. Rough transparent
recolor attempts were discarded. The final dark PNGs have a deliberate background; light PNGs remain transparent.

The root and generated READMEs select the full logo with a theme-aware HTML picture and a light fallback, following
[GitHub's guidance](https://github.blog/developer-skills/github/how-to-make-your-images-in-markdown-on-github-adjust-for-dark-mode-and-light-mode/).
Both generated host packages carry all four PNGs. The Codex interface uses the square icons for `logo`,
`composerIcon`, `logoDark` and `composerIconDark`, following the
[official package guidance](https://developers.openai.com/plugins/build/plugins). Claude receives the assets
without adding unsupported icon metadata to its manifest. Edit canonical assets and rebuild; do not patch copies.
