# Named playbooks

Describe the outcome normally; the entry chooses a playbook. Experts can say “Use Proofwork. Follow Repair Behavior to fix the export” or “Use Proofwork. Follow Explore Options for the parser.” These names are procedures, not additional slash commands or skills.

| Playbook | Suggested tier | Compatible checkpoint stage |
| --- | --- | --- |
| [Quick Fix](../shared/playbooks/quick-fix.md) | light | bug-fix |
| [Clarify Path](../shared/playbooks/clarify-path.md) | light | investigate |
| [Repair Behavior](../shared/playbooks/repair-behavior.md) | standard | bug-fix |
| [Add or Change Behavior](../shared/playbooks/add-or-change-behavior.md) | standard | feature |
| [Simplify Structure](../shared/playbooks/simplify-structure.md) | standard | refactor |
| [Improve Measurement](../shared/playbooks/improve-measurement.md) | standard | investigate |
| [Justify Structure](../shared/playbooks/justify-structure.md) | full | architecture |
| [Harden and Finish](../shared/playbooks/harden-and-finish.md) | full | production-finish |
| [Coordinated Audit](../shared/playbooks/coordinated-audit.md) | full | review |
| [Explore Options](../shared/playbooks/explore-options.md) | full | prototype |
| [Long Task](../shared/playbooks/long-task.md) | full | feature |
| [Shape Intent](../shared/playbooks/shape-intent.md) | special | brainstorm |
| [Resume Work](../shared/playbooks/resume-work.md) | special | feature |

Explained routing returns procedure.id, name, path, suggested tier, actualTier and whether the playbook was explicitly requested. The stage field remains the existing checkpoint identifier. Root reads only the selected guide, then its selected skills and phase guidance. Re-route when the current stage changes; preserve the objective and accepted constraints.

Light paths remain bounded and carry no ledger/team requirement. Standard paths apply the lenses needed for their behavior. Full is the suggested tier for consequential architecture, production, coordinated audits, broad alternatives and extended work. Bounded advice or two-candidate probes may stay standard under automatic routing. Explicitly invoking a full playbook selects full coordination and cannot be demoted by a light override. Risk floors still apply to Quick Fix; naming it cannot make a behavioral or security change mechanical.

Clarify Path is read-only even when its prompt mentions a fix. Other read-only qualifiers also preserve inspection authority. A security explanation may still receive full review guidance; a higher tier grants no edit or deployment authority. Review-only work never becomes automatic repair. Full-tier audit and finishing schedule impact mapping before authorized edits and independent challenge on the integrated result.

Shape Intent hands an accepted first slice to another playbook. Resume Work first inspects the explicitly bound run and uncertain external effects; if there is no checkpoint, say so and reconstruct from available evidence. Long Task sequences checks and checkpoints while respecting existing goal limits. None of these procedures creates a goal, background service or deployment authorization.

Initial context accounting includes the selected playbook guide, required preparation/options and selected entries. Review/report entries are deferred and disclosed separately; conditional references and task/model tokens remain additional. The comparative harness injects the same selected guide. This proves consistent input selection, not live agent adherence or a quality gain.
