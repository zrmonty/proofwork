---
name: audit-stack
description: Coordinate Proofwork's security, dead-code, DRY, performance, coverage, architecture and maintainability audits into one scoped repair workflow with integrated evidence.
---

# Audit stack

Run the relevant Proofwork audits as one coordinated task. By default, audit the requested surface and make supported, behavior-preserving local repairs within that scope. Honor report-only/read-only instructions. Deployment, credential operations, public API retirement, policy changes and external publication still require their actual authorization.

## Establish one scope and baseline

Read [use-proofwork](../use-proofwork/SKILL.md) and its live runtime/goal adapters, then follow its ownership, checkpoint and evidence workflow. Loading that coordinator does not redispatch this audit recursively. Native goal support follows the host; invocation alone does not create a goal. Inspect working changes, consumers, supported configurations, build/test commands, executable-source inventory and relevant artifact identity.

Define the user's preserved behaviors and audited paths once. Capture existing failures, actual line/branch coverage and relevant workload observations before editing when tools are available. Missing branch metrics, profiling access or a below-gate legacy target remain gaps. Do not narrow the source target or fabricate a baseline to get a pass.

## Apply the audit lenses

Load each core skill and use its relevant probes. Record each lens as assessed with findings, assessed with no findings, not applicable with a reason, or unverified with a missing capability. Reading a skill is not executing an audit.

| Lens | Skill and responsibility |
| --- | --- |
| Security | [security-hardening](../security-hardening/SKILL.md): trust boundaries, supported vulnerabilities and safe remediation. |
| Dead code | [dead-code-audit](../dead-code-audit/SKILL.md): supported-root reachability and exclusively attached test/artifact removal. |
| DRY | [dry-audit](../dry-audit/SKILL.md): duplicated knowledge and a coherent owner without false sharing. |
| Performance | [performance-increase](../performance-increase/SKILL.md): representative bottlenecks, correctness and comparable measurements. |
| Tests and coverage | [tdd-95](../tdd-95/SKILL.md): meaningful assertions, separate 95% floors and test economy. |
| Architecture | [architecture-fit](../architecture-fit/SKILL.md): why each consequential component is needed and simpler adequate alternatives. |
| Maintainability | [thermonuclear review](../thermo-nuclear-code-quality-review/SKILL.md) and [clean-code](../clean-code/SKILL.md): invariant ownership, structural clarity and hard file-size enforcement. |

Use [functional-programming](../functional-programming/SKILL.md), [data-driven-development](../data-driven-development/SKILL.md) and applicable language guidance across all repairs. Python remains strictly typed. For real UI surfaces, include [frontend-design](../frontend-design/SKILL.md) and [humanizer](../humanizer/SKILL.md), with actual rendered evidence for visual claims. Include [production-finish](../production-finish/SKILL.md) for requested release readiness or relevant delivery/exposure findings; do not invent hosting work for an ordinary library audit. [Commit features](../commit-features/SKILL.md) applies when delivery includes commits/pushes.

## Merge findings before editing

Use one finding ledger: safe location, observed mechanism, user impact, evidence, responsible owner, affected contracts, smallest complete repair, checks and status. Merge reports of the same root cause and retain their distinct verification obligations. Prioritize security/data-loss/correctness, then supported subtraction and duplication cleanup, then measured performance and structural improvements. Real dependencies may change the order.

Establish reachability before extracting a duplicate helper: there is no benefit in consolidating dead code. Fix ownership/security before optimizing a vulnerable path. Keep initial performance observations, but remeasure on the final comparable workload after repairs; source deletions and changed behavior can invalidate prior measurements. Track justified coverage-inventory changes explicitly rather than presenting denominator shrinkage as better testing.

Independent inspection can be parallel where the live host permits, with bounded explicit ownership under use-proofwork. Do not run overlapping modifying auditors against the same files. Integrate repairs sequentially by dependency, notifying consumers when assumptions change. One reviewer can assess several lenses; separate findings and evidence rather than pretending this provides multiple independent verdicts. No audit quota or required abstraction count.

## Repair and verify the combined result

Follow the owning skill's distinguishing regression and scope rules. Preserve behavior, validation, authorization, cleanup and public compatibility. Remove attached tests only for proven removed responsibilities; DRY consolidation and test economy must retain unique failure detectors. Never delete a failing survivor or disable logging/features merely to produce a clean audit.

After integration, run the affected build/type checks and discovered tests, actual coverage collection with independently enumerated surviving source, relevant security/artifact checks and comparable performance checks. Run the bundled 500-line code gate with additive custom/ignored-source inventory. Revalidate findings after later edits; checks on an earlier identity do not close the final artifact. Missing tools or external actions leave their criteria incomplete while useful independent work continues.

## Deliver one audit result

Report the audited snapshot/surface, per-lens status, prioritized findings, fixes and retained decisions, final artifact checks and concrete remaining actions. Distinguish fixed and verified, mitigated, unresolved and investigation status. A supported no-change result is valid. Do not equate package build, scanner silence, 95% execution coverage or a microbenchmark with comprehensive security, correctness or production readiness.

Finish the authorized scoped workflow under use-proofwork's completion rules. Required unresolved gates remain incomplete; explain which evidence is missing instead of stamping every lens passed. Keep raw secret-bearing output out of transcripts and exported evidence.
