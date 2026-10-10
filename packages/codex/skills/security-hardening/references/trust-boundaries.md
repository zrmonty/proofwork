# Trust-boundary probes

Use only probes that match the application's actual surfaces. These are original investigation questions, not a universal list of mandatory middleware.

## Identity, resources and state

Follow identity from the validated session/token into the protected operation. Distinguish signed-in identity from permission for this action on this resource. Check resource and tenant ownership on the server, including list/detail, exports, bulk operations, jobs and alternate methods. IDs supplied by the caller identify a candidate resource; they do not establish its owner. Unknown roles or missing policy should not silently gain privilege. Preserve intentional sharing and public resources.

Use synthetic principals from different tenants and roles. Test a legitimate action and a denied action against the same entry point. A hidden button, guessed-resistant ID or client-side tenant filter does not settle access control. Check changed permissions, stale state and batch items independently where needed. Avoid leaking protected resource existence in responses when the disclosure policy forbids it.

Inspect session expiration, logout/revocation, password-reset and recovery flows that exist in scope. Verify token claims/signatures through the established library and provider contract; decoding a token alone is not verification. Evaluate cookies, CSRF and proxy settings against the actual authentication and routing topology. CORS is a browser access policy, not server authorization. Do not invent password rules or replace the project's identity provider during a focused repair.

The [OWASP authorization reference](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) supplies current technical grounding on server-side enforcement. The probes here are authored for Proofwork.

## Inputs reaching interpreters and privileged effects

Trace external values into SQL, shell/process options, templates, HTML, deserialization, file paths and outbound requests. Use parameter binding for data; dynamic identifiers need their own permitted mapping. Passing a command argument list avoids shell interpolation but does not prevent option interpretation. Context-appropriate escaping or sanitization must match the output sink; a generic escape helper does not cover every interpreter.

For files/uploads/archives, check the resolved destination, traversal, symlinks where relevant, upload serving behavior, size/count limits and extraction overwrite policy. A textual path-prefix check can accept a sibling directory; a precheck can race a later filesystem operation. Use the existing safe root/handle mechanism and test the actual relevant path semantics. Do not execute uploaded content or trust a file extension as content validation.

For URL fetching, identify allowed schemes, destinations, redirects, resolved addresses and the connection actually made. A URL hostname check alone does not cover redirects, alternate IP forms or DNS changes. Prefer constrained destinations or an established egress boundary; never claim one regex is complete SSRF protection. Test locally with controlled destinations. Consult the current client and [OWASP SSRF reference](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) before changing redirect or resolution behavior.

## Exposure, dependencies and resource use

Inspect public responses, logs, browser bundles, source maps, debug routes and build artifacts for sensitive capabilities. Inspect relevant image contexts/layers when images are in scope. Redact before output. Distinguish intentionally public identifiers from credentials by actual capability and provider policy; naming conventions alone are insufficient.

Check locked packages, build scripts, CI permissions, artifact origins and secret access at the relevant execution boundary. Record advisory provenance and date. A lockfile update without rebuilding and testing the consumed artifact does not establish remediation; avoid blanket upgrades that obscure compatibility.

Find unbounded parse/upload sizes, decompression, regex or algorithmic work, queries, subprocess output, queued work and fan-out only where an actor can drive them. Place limits at the owning boundary with an explicit error/cleanup contract. Preserve valid large workflows and use local bounded cases; load generation against a live service requires authorization. Do not call every loop a denial-of-service vulnerability without a reachable input and meaningful cost.
