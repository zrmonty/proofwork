# Proofwork brand assets

- `proofwork-logo.png`: the approved full logo, including the wordmark, on a transparent background.
- `proofwork-icon.png`: the icon-only variant for square plugin listing and composer surfaces.

Both images were created with the built-in image-generation tool. The icon edit used the approved full logo as
its reference: remove the wordmark, retain the rounded navy P and amber check, center the mark on a square
transparent canvas, and add no text, border or background.

The root README uses the full logo. Both generated host packages carry these two PNGs and display the full logo
in their READMEs. The Codex interface uses the square icon for `logo` and `composerIcon`, following the
[official package guidance](https://developers.openai.com/plugins/build/plugins). Claude receives the assets
without adding unsupported icon metadata to its manifest. Edit canonical assets and rebuild; do not patch copies.
