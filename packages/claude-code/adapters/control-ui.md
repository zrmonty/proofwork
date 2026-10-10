# Browser verification

Use an actually connected browser tool, following its supplied API and permission rules. Browser access, Electron control and native desktop control are separate capabilities. An installed automation dependency alone does not expose the user's tabs or credentials. First release certifies browser flows only where connected tools are present.

Inspect the running UI at desktop and narrow mobile sizes, exercise the primary flow and keyboard navigation, check required error/loading/empty/success states, and capture revision-bound screenshots and observed interactions. An independent reviewer compares the combined render to the selected brief. If browser access is missing, keep visual verification incomplete and continue other useful checks; code builds cannot substitute for rendered evidence.
