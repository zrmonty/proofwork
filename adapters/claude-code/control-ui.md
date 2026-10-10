# Browser verification

## Capability discovery

Use an actually connected browser tool, following its supplied API and permission rules. Browser access, Electron control and native desktop control are separate capabilities. An installed automation dependency alone does not expose the user's tabs or credentials. First release targets browser flows verified through actually connected tools; tool availability alone does not certify a flow.

## Rendered verification and limits

Inspect the running UI at desktop and narrow mobile sizes, exercise the primary flow and keyboard navigation, check required error/loading/empty/success states, and capture revision-bound screenshots and observed interactions. An independent reviewer compares the combined render to the selected brief. If browser access is missing, keep visual verification incomplete and continue other useful checks; code builds cannot substitute for rendered evidence.
