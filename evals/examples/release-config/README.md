# Executed release-configuration repair

This is a production-style fixture repair, not a deployed application or a comparative agent success story. Synthetic secrets and a sample durable path are used. The original public fixture remains intentionally broken for evaluation.

Before: [the baseline](../../ab/fixtures/release-config/module.mjs) spreads every server environment setting into public configuration and substitutes a default port when a supplied value is invalid. That exposes server capabilities to browser delivery and can start with unintended settings.

After: [the repair](module.mjs) validates required server settings and decimal/range port constraints, constructs public configuration from an explicit permitted field, and leaves caller input unchanged. Required-setting errors avoid printing the value. The comparison is a real source change tested against the original visible, withheld acceptance and preservation checks.

See [executed evidence](../../results/systems-outcomes-20261010.json). Before, public and acceptance checks fail while preservation passes. After, all three pass. The latter checks invalid port forms, blank/missing required settings, caller preservation and public/server separation. This establishes the fixture's contract; it does not scan a browser bundle or prove hosting readiness.

The operator still needs to wire validation before listening, inspect the built public artifact, verify protected secret delivery, exercise restart/restore and check effective host configuration. No staging, live deployment, credential response or generalized secret-detection claim is made.

Reproduce through `verifyTask` from the comparative harness, passing the original fixture and this example as candidate folders with separate disposable verification directories. Tests copied from the original fixture are used; candidate-local test edits cannot replace them. Logical withholding is not protection from a malicious same-account runner.
