import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const requireValue = (condition, message) => {
  if (!condition) throw new Error(message);
};
const validPath = (value) =>
  typeof value === "string" &&
  value.length > 0 &&
  !/[\\:\x00-\x1f]/.test(value) &&
  !value.startsWith("/") &&
  value.split("/").every((part) => part && part !== "." && part !== "..");

export function checkCoverage(report, inventory, threshold = 95) {
  requireValue(
    Number.isFinite(threshold) && threshold >= 95 && threshold <= 100,
    "threshold must be between 95 and 100",
  );
  requireValue(
    Array.isArray(inventory) &&
      inventory.length > 0 &&
      inventory.every(validPath) &&
      new Set(inventory).size === inventory.length,
    "inventory must contain unique repository-relative file paths",
  );
  requireValue(
    report?.schemaVersion === 1 &&
      typeof report.revision === "string" &&
      report.revision.trim() &&
      typeof report.tool === "string" &&
      report.tool.trim() &&
      Array.isArray(report.files),
    "report requires schemaVersion 1, revision, tool and files",
  );
  const expected = new Set(inventory);
  const seen = new Set();
  const totals = { lines: { covered: 0, total: 0 }, branches: { covered: 0, total: 0 } };
  for (const file of report.files) {
    requireValue(file && validPath(file.path), "invalid report file path");
    requireValue(expected.has(file.path), `unexpected coverage file: ${file.path}`);
    requireValue(!seen.has(file.path), `duplicate coverage file: ${file.path}`);
    seen.add(file.path);
    for (const metric of ["lines", "branches"]) {
      const counts = file[metric];
      requireValue(
        counts &&
          Number.isSafeInteger(counts.covered) &&
          Number.isSafeInteger(counts.total) &&
          counts.covered >= 0 &&
          counts.total >= counts.covered,
        `invalid or missing ${metric} counts: ${file.path}`,
      );
      totals[metric].covered += counts.covered;
      totals[metric].total += counts.total;
      requireValue(
        Number.isSafeInteger(totals[metric].total) && totals[metric].total <= Number.MAX_SAFE_INTEGER / 100,
        "coverage counts exceed supported range",
      );
    }
  }
  requireValue(
    seen.size === expected.size,
    `missing coverage files: ${inventory.filter((file) => !seen.has(file)).join(", ")}`,
  );
  requireValue(totals.lines.total > 0, "coverage target contains no executable lines");
  const metrics = Object.fromEntries(
    Object.entries(totals).map(([name, counts]) => [
      name,
      {
        ...counts,
        percent: counts.total === 0 ? null : (counts.covered / counts.total) * 100,
        passed: counts.total === 0 || counts.covered * 100 >= threshold * counts.total,
      },
    ]),
  );
  return {
    passed: Object.values(metrics).every((metric) => metric.passed),
    threshold,
    revision: report.revision,
    tool: report.tool,
    files: seen.size,
    metrics,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === "--help") {
      console.log("node check-coverage.mjs --report REPORT.json --inventory INVENTORY.json [--threshold 95..100]");
    } else {
      const options = {};
      for (let index = 0; index < args.length; index += 2) {
        const key = args[index];
        requireValue(
          ["--report", "--inventory", "--threshold"].includes(key) && args[index + 1] && !Object.hasOwn(options, key),
          "invalid or duplicate coverage option",
        );
        options[key] = args[index + 1];
      }
      requireValue(options["--report"] && options["--inventory"], "supply --report and --inventory");
      const [report, inventory] = await Promise.all(
        [options["--report"], options["--inventory"]].map(async (file) => JSON.parse(await readFile(file, "utf8"))),
      );
      const result = checkCoverage(
        report,
        inventory,
        options["--threshold"] === undefined ? 95 : Number(options["--threshold"]),
      );
      console.log(JSON.stringify(result, null, 2));
      if (!result.passed) process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
