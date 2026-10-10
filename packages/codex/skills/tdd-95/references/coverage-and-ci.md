# Coverage and CI

Use this reference to make the 95% requirement measurable. Follow the project's installed collector and supported language versions rather than introducing a new runner by default.

## Define the denominator once

Record the first-party executable source roots, exclusions, collector/version, build mode and metric definitions. Enumerate the intended sources and compare them with the report: a missing unimported file is a measurement defect, not proof it has no uncovered code. Remap transformed code to original sources where the tool supports it; generated output must not double-count the same code.

Line and branch coverage are separate ratios:

```text
line rate = covered executable lines / executable lines
branch rate = covered branch outcomes / branch outcomes
pass = tests passed AND line rate >= required line rate
                    AND branch rate >= required branch rate
```

The default required rates are 0.95; keep an existing 0.98 or 1.00 requirement. Compare counts or sufficient precision so 94.96% displayed as 95% does not pass. Statement, function, region and condition coverage are useful additional metrics, but do not relabel them as lines or branches. Where the selected target genuinely has zero branch opportunities, record its zero denominator and verify it with a working branch collector; an absent branch field is different.

A multi-language target needs a supported report for every selected component. Do not average incompatible branch models into a persuasive but meaningless global number. Preserve existing per-file or package constraints. The default aggregate target floor does not justify leaving a critical changed component untested because a large unrelated module offsets it.

## Make the gate a real process result

Use the existing runner's separate line and branch thresholds where supported. Otherwise use a small repository-owned check over its machine-readable report, with these outcomes:

| Observation | CI outcome |
|---|---|
| Tests fail, do not execute, or selected cases are unexpectedly skipped | Nonzero exit |
| Report absent, stale, malformed, missing selected source files or missing required metric | Nonzero exit; describe measurement failure |
| Either required ratio below its threshold | Nonzero exit; report counts and gap |
| Both ratios meet thresholds and required tests pass | Zero exit |

Generate fresh reports from the final source identity. Do not merge an old successful run into new evidence; combine only intentionally partitioned runs of the same source and configuration. Preserve the test command's exit status through pipelines and report generation. Exercise the gate once with a deliberately failing small fixture or an isolated temporarily stricter threshold, restore configuration, and show the ordinary command passing. Do not publish a known failing production change just to test CI.

Watch-mode subsets and changed-file filters are useful during red/green work; they do not replace the final selected-target measurement. Never enable success with no tests as a route to the gate.

## Use the bundled report checker

When the existing collector cannot enforce both ratios independently, export its actual file counts into the normalized format and run:

```text
node <plugin-root>/scripts/check-coverage.mjs --report coverage-normalized.json --inventory coverage-inventory.json --threshold 95
```

`coverage-inventory.json` is a JSON array of repository-relative executable source file paths, using forward slashes. Enumerate it from the selected source roots before collection and apply the agreed exclusions; do not derive it solely from the files imported by tests. The normalized report has this shape:

```json
{
  "schemaVersion": 1,
  "revision": "source identity measured by this run",
  "tool": "collector name and version",
  "files": [
    {
      "path": "src/rules.ts",
      "lines": { "covered": 98, "total": 100 },
      "branches": { "covered": 38, "total": 40 }
    }
  ]
}
```

Use a higher threshold when the project already requires it. Missing, extra or duplicated source files, invalid counts, absent branch measurements and insufficient ratios fail the check. An actual zero-branch file still supplies an explicit branch object with zero counts. The checker validates aggregate counts over the explicit target; preserve stricter project-specific per-file checks separately.

The checker does not run tests, collect coverage or authenticate the report's source identity. Keep the original collector artifact, generating command and measured revision with the normalized report. Verify that the export preserves counts and that the independently selected inventory is complete. A fabricated report or a stale report can be structurally valid; neither is acceptable evidence. Chain successful tests, collection, normalization and this check with failure propagation rather than treating the final command as the entire workflow.

## Language-specific traps

**TypeScript and JavaScript.** Read the installed runner's coverage-provider documentation. Configure explicit source inclusion because import-only collection can hide untouched files. Check source-map remapping and branches produced by transpilation. For a project already using Vitest, inspect `coverage.include` and separate `coverage.thresholds.lines` / `coverage.thresholds.branches`; preserve higher values and disable automatic threshold rewriting. The [official coverage configuration](https://vitest.dev/config/coverage) documents these options. Verify their behavior against the installed version rather than copying a configuration for an incompatible release.

**Python.** Enable branch collection and an explicit source target. Coverage.py can discover unexecuted sources when source is configured; inspect namespace-package behavior and report omissions. Its overall percentage under branch collection combines statement and branch opportunities, so a single `--fail-under=95` is not proof of two separate 95% gates. Use the machine-readable counts to check covered statements and covered branches independently, explaining that its source statement accounting is the collector's executable-line model. Read [branch measurement](https://coverage.readthedocs.io/en/latest/branch.html), [source selection](https://coverage.readthedocs.io/en/latest/source.html) and [JSON reporting](https://coverage.readthedocs.io/en/latest/commands/cmd_json.html). Keep subprocess coverage and intentionally combined shards aligned with the same identity.

**Rust.** Match coverage tooling to the compiler's LLVM version and the project's supported toolchain. Stable instrumentation does not establish that the installed toolchain exposes the required branch model. The [rustc coverage guide](https://doc.rust-lang.org/rustc/instrument-coverage.html) covers instrumentation; the [coverage options documentation](https://doc.rust-lang.org/unstable-book/compiler-flags/coverage-options.html) describes branch options under an unstable interface. Inspect actual collector capabilities and output. A line-only report cannot pass this skill's branch gate. Do not silently switch a stable project to nightly; report the unsupported gate and propose the smallest compatible measurement path.

## Examples of honest decisions

- 98% lines and 91% branches: fails; focus on missing alternatives rather than adding more happy paths.
- 96% lines and 96% branches with no negative authorization assertion: numerical gate passes, behavior verification remains incomplete.
- 100% imported files while an executable unimported module is absent: report incomplete; correct source inclusion before deciding.
- Legacy target at 72%, changed behavior covered: useful progress, selected-target gate still fails. Report the remaining work rather than declaring completion.
- Unsupported Rust branch collection: line evidence can be reported, 95% gate remains unverified pending a supported approach.
