# Browser verification

Discover an available browser integration and read its API/skill before operating it. Prefer the user's specified browser/session; do not assume an installed browser automation library grants access to authenticated tabs. Exercise the running application's primary flow, desktop and narrow mobile views, keyboard operation and required states. Record revision-bound screenshots and interaction observations with actual viewport and URL. The visual reviewer examines the render against the design brief, not just source files.

Browser, Electron and native desktop access are separate capabilities. First release targets browser applications. If access is unavailable, keep visual acceptance incomplete, continue independent code checks, and state the exact missing capability. Do not claim visual quality from compilation or a screenshot alone. User permissions and sensitive-data handling remain in force.
