# Exposure checks and response

Use this reference to inspect sensitive release surfaces or handle a suspected credential leak. The purpose is to prevent public delivery of secret capabilities and make a discovered exposure actionable without spreading it.

## Follow the delivery path

Identify the exact candidate release and the surfaces an unauthenticated person, an ordinary user, or an image consumer can read. Match the scope to the app rather than searching unrelated user directories or accounts.

| Surface | What to inspect | Useful observation |
| --- | --- | --- |
| Client delivery | Production bundles, inline configuration, static files, emitted source maps, downloadable archives | A locally redacted scan of the built output plus inspection of configuration injection |
| HTTP behavior | Intended public endpoints, debug/error responses, auth boundaries, static-server rules | Authorized requests to a local or explicitly permitted environment with response content redacted |
| Repository | Tracked source, release configuration, scoped untracked release inputs, relevant Git history | Safe locations and finding categories; history coverage stated explicitly |
| Build pipeline | Public variable prefixes, dependency install credentials, command tracing, CI artifacts and logs | Secret handling traced from input to output without displaying values |
| Container | Build context, copied files, image configuration, layers, history, build cache or exported artifacts in scope | Locally inspected and redacted metadata; no raw image/environment dump |

Do not blindly display scanner output. Before using a tool, inspect its output mode and redaction behavior. A scanner that prints matching lines can leak the very material being audited. Prefer output containing only safe file locations, rule IDs, counts, and status. If a path itself embeds sensitive data, redact that too. Do not send source or build artifacts to a third-party scanner without authority for that disclosure.

Treat production output as an artifact with an identity. A source scan before a build cannot establish that generated assets are safe. A scan of one output directory does not cover an older public deployment, CDN cache, published image, or history. Record each included and excluded surface. Use representative benign fixtures to confirm the scanner examines the intended files without adding real credentials to tests.

## Classify capabilities, not spelling

For a suspected value, establish its provider and effective permissions through safe local context and official provider documentation. A browser-intended publishable identifier may be acceptable when the provider explicitly supports that use and the application's authorization rules prevent unintended operations. Conversely, a harmless-looking token can grant administrative or billing access. Public-prefixed variables are delivery instructions, not permission classifications.

Keep examples schematic. A finding report can say:

```text
Surface: generated client bundle
Finding: server credential capability emitted by build-time configuration
Location: safe output path; credential and matching line withheld
Action: move access behind the authorized server boundary and rebuild
Release status: blocked pending revocation and replacement verification
```

This is an example of a report, not evidence that a scan ran. A noisy scanner match needs adjudication. An uncertain capability remains an open finding until authoritative context resolves it; do not rotate an intentionally public identifier solely to make a scanner green.

## Respond without extending the exposure

1. Record the safe location, likely capability, exposure surface and accountable owner. Keep the actual value out of conversation, tool arguments, shared evidence and logs. Do not test a discovered credential against a provider without authorized account access and a reason to do so.
2. Remove the secret from public delivery at its source. Move the privileged operation behind the application's authorized server boundary or inject the value only into the protected runtime. Rebuild and inspect the affected output; deleting a file after it entered an image layer does not remove it from earlier layers.
3. If exposure is established, arrange revocation or rotation through authorized operations. Plan replacement rollout so required services can recover without embedding the replacement in public output. If account access is missing, identify the owner's exact required action and leave readiness blocked. Removing current source alone does not invalidate a compromised credential.
4. Address already distributed copies within scope: active deployment, CDN output, published artifacts, or images. Changes to remote caches, registries, credentials, history, or production services require their own authority. Preserve history without separately authorized rewriting; rewriting history also cannot recall copies other people already have.
5. Verify the replacement release and relevant boundaries without printing sensitive values. Report revoked/replaced only when the operation's observed outcome supports it. Keep unknown propagation or inaccessible old surfaces explicit.

Credential handling is only one part of release access. Check whether intended browser-public configuration sits behind correct server policies, storage access rules and authentication. A bundle containing no secret does not prove that a public endpoint cannot read private data.
