# Coverage and CI

Use the installed collector/supported versions to make the 95% gate measurable; do not introduce a runner by default.

## Independent denominator

Record executable source roots, exclusions, collector/version, build mode and metrics. Enumerate sources independently and compare reports: absent unimported code is missing measurement, not coverage. Remap transformed sources; do not count generated duplicates.

Require passing tests plus covered/executable lines >=95% and covered/possible branch outcomes >=95%, preserving stricter existing/package/per-file floors. Compare sufficient precision/counts: rounded 94.96% fails. Statements, functions, regions and conditions are not interchangeable metrics. A genuinely zero-branch target needs an explicit verified zero denominator; absent branch data is different.

Measure every selected language component without averaging incompatible models. Large unrelated modules cannot justify leaving critical changed behavior untested.

## Failure-propagating gate

Fail on failed/unexecuted/unexpectedly skipped tests; absent, stale, malformed or incomplete reports; missing metrics; or either insufficient ratio. Generate fresh reports from final source/configuration identity, including dirty inputs. Segregate prior output so failed collection cannot reuse it. Preserve test exit through pipelines. Exercise the gate with an isolated failing fixture/stricter threshold, restore it and show ordinary checks passing; never publish a failing production change for this demonstration.

Merge only intentional shards from matching source/configuration using supported collector operations. Count overlapping opportunities once, never sum counts/average percentages. Every intended shard must pass; partial unions cannot replace missing behavioral checks. Coverage.py [combine](https://coverage.readthedocs.io/en/latest/commands/cmd_combine.html) supports paths/data merging, but path equivalence does not prove content equivalence. Watch/subset runs help iteration, not final selected-target acceptance; never accept success with no tests.

## Bundled report check

Export actual counts when the collector cannot enforce separate gates:

```text
node <plugin-root>/scripts/check-coverage.mjs --report coverage-normalized.json --inventory coverage-inventory.json --threshold 95
```

Inventory is an independently enumerated JSON array of repository-relative executable paths using forward slashes, selected before collection with agreed exclusions. Example report:

```json
{
  "schemaVersion": 1,
  "revision": "measured source identity",
  "tool": "collector/version",
  "files": [{
    "path": "src/rules.ts",
    "lines": { "covered": 98, "total": 100 },
    "branches": { "covered": 38, "total": 40 }
  }]
}
```

Missing/extra/duplicate paths, invalid counts, absent branches and insufficient ratios fail. Zero-branch files still provide zero-count objects. Preserve stricter per-file gates separately. This checker neither runs tests nor authenticates identity. Retain original collector artifact, invocation/provenance and faithful normalization; fabricated/stale reports can be structurally valid. Chain tests, collection, normalization and checking with failure propagation.

## Language traps

**TypeScript/JavaScript:** configure explicit inclusion, source maps and transpiled branches. Existing Vitest projects inspect separate lines/branches thresholds, preserve stronger values and disable automatic rewriting. Follow [coverage configuration](https://vitest.dev/config/coverage) for the installed version.

**Python:** enable branches/explicit sources and inspect namespace omissions. Coverage.py overall branch percentage combines statements and branches; fail-under=95 alone does not prove separate floors. Check actual statement/branch counts, explaining executable-line accounting. Read [branches](https://coverage.readthedocs.io/en/latest/branch.html), [sources](https://coverage.readthedocs.io/en/latest/source.html) and [JSON](https://coverage.readthedocs.io/en/latest/commands/cmd_json.html). Subprocesses/shards retain matching identity.

**Rust:** match LLVM/compiler/toolchain. Stable instrumentation does not establish supported branch metrics. Read [instrumentation](https://doc.rust-lang.org/rustc/instrument-coverage.html) and [unstable branch options](https://doc.rust-lang.org/unstable-book/compiler-flags/coverage-options.html), checking actual output. Line-only cannot pass branches; do not silently switch stable projects to nightly.

Numerical coverage is separate from behavior: 98% lines/91% branches fails; 96% both without permission assertions may pass numbers but leave acceptance incomplete. Legacy below-gate targets and unsupported metrics remain incomplete despite useful scoped progress.
