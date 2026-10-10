# Security-hardening skill verification — 0.8.0

Adds the originally authored security-hardening skill with two conditional references, a specification, intent routing, root/production integration and README command examples. Both generated packages include eighteen skills. No scanner dependency, global hook or application security framework was added.

## Behavior contract

The skill audits scoped trust boundaries and applies authorized local repairs at shared enforcement points. It distinguishes executed reproductions, supported static traces and scanner candidates. Coverage includes relevant identity/resource authorization, injection, file/URL boundaries, exposure, dependencies/build execution and resource limits. Findings must explain prerequisites, impact, evidence, remediation and final status. Legitimate behavior, current authorization, functional decisions, strict Python typing and existing verification gates remain authoritative.

Secret values and fragments must be redacted before tool output. Real credential rotation, live infrastructure changes and third-party probing need their own authorization. Source removal does not close credential response. A clean scan or pure policy function alone never establishes exhaustive security or enforcement at the effect boundary.

Technical grounding was checked against current official [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) and [SSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html). The instructional workflow and probes were independently written for Proofwork; no existing skill assets were imported.

## Executed verification

- A new routing regression failed before implementation because security-hardening was absent. After implementation, security audit/hardening, authorization bypass, SQL injection, SSRF and exposed credentials select the skill. Typography audits, parser optimization and security-team meeting notes do not.
- `npm run check` passed all 23 automated tests, built both eighteen-skill packages and passed the hard code-file maximum.
- The canonical skill validator passed; generated package reference validation passed.
- Strict Claude package validation passed through the official ephemeral npm CLI. The global `claude` command was unavailable; its attempted invocation did not validate anything. The successful fallback emitted an informational README install suggestion.
- `git diff --check` passed and the current-source excluded-name scan found no matches.
- Codex 0.8.0 was installed. All three installed security skill/reference files matched the built package hashes.

Raw check output remains ignored locally. This change adds guidance and routing; it does not perform an application audit or fix vulnerabilities in an unrelated project.

## Limits

No security scanner, live target, credential rotation, browser attack scenario or fresh host behavioral evaluation was run. Routing and package validators establish structural availability, not that every class of vulnerability will be found or remediated. Application-level regression checks and artifact inspection remain obligations when the skill is invoked against an actual target.
