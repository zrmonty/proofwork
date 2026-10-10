# Remediation and verification

## Preserve evidence without exposing data

Record the vulnerable mechanism and a synthetic input before changing it. State whether evidence is an executed regression, a static source-to-sink trace or a scanner candidate. If a scanner prints secrets by default, configure its safe output first or process private results through a redacting adapter before any transcript output. Do not open raw findings just to inspect a credential. A summary should retain safe paths and rule identifiers without values or revealing fragments.

## Fix the shared enforcement point

For an export endpoint filtering by caller-supplied tenant alone, locate how the authenticated principal's allowed scope is established. Correct the server resource query or shared policy boundary so all affected exports obey that scope. Retain authorized sharing, administrator policy, pagination and valid empty results. A pure permission predicate can make the policy testable; it must receive validated inputs and be enforced before the effect using current state. Fix callers that bypass the boundary rather than adding a second independent policy copy.

For injection, eliminate the data-to-code interpretation at the actual sink using the incumbent binding/encoding API. Confirm dynamic identifiers, ordering and secondary callers cannot bypass it. For dependency vulnerabilities, choose a supported corrected version or remove an unused affected capability; inspect lock changes and the consumed build. Configuration mitigations need evidence that the application actually loads them and that a bypass does not preserve the vulnerable path.

For exposed credentials, remove the capability from public source and artifacts and rebuild. Authorized revocation/rotation and replacement deployment are separate effects. Until those occur, mark the credential response unresolved. Preserve useful audit logs and diagnostics with redaction rather than dropping all evidence of attempted abuse.

## Checks that distinguish a repair

Cover a legitimate use and a prohibited use through the actual adapter when possible. Assert both the denied result and absence of the prohibited side effect: no unauthorized write, export, process execution or network request. Test the important alternate route or bulk item if it shares the enforcement rule. Include conflict/stale-permission handling where the defect depends on a race. A mocked policy that always denies cannot establish that the real route calls it correctly.

Retain the initial failure and final command outcome. Re-run affected tests, strict type checks, the agreed coverage gate and the relevant artifact/scanner check after integration. A static review does not replace browser rendering or deployment configuration checks; an unavailable service or scanner is a gap. Do not promise comprehensive penetration testing from a small fixture.

## Report and stop honestly

Use a finding record such as: location; mechanism; prerequisites; impact; evidence; fix; final artifact identity; checks; status; remaining action. Rank actual impact and exposure before cosmetic security flags. Explain uncertainty when reachability or provider behavior cannot be established. A clean verdict is valid when supported; a findings quota encourages false positives.

Never weaken a type, test, source inventory or security gate to close a finding. If a repair needs a product-policy decision, preserve useful independent work and request that specific decision. A local audit does not authorize deleting user data, changing public history, publishing findings or acting on third-party systems.
