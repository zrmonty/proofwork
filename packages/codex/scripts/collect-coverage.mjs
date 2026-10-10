import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { checkCoverage } from "./check-coverage.mjs";

const fail = (message) => {
  throw new Error(message);
};
function normalizeSource(source, repository) {
  const absolute = path.isAbsolute(source) ? source : path.resolve(repository, source);
  return path.relative(repository, absolute).split(path.sep).join("/");
}
function metric(record, covered, total) {
  if (!record[covered] || !record[total]) fail(`LCOV is missing ${covered}/${total}`);
  for (const key of [covered, total])
    if (!/^[0-9]+$/.test(record[key])) fail(`invalid LCOV count ${key}`);
  return { covered: Number(record[covered]), total: Number(record[total]) };
}
function coverageFile(record, repository) {
  return {
    path: normalizeSource(record.SF, repository),
    lines: metric(record, "LH", "LF"),
    branches: metric(record, "BRH", "BRF"),
  };
}
function parseRecord(block) {
  const record = {};
  for (const line of block.split(/\r?\n/).filter(Boolean)) {
    const separator = line.indexOf(":");
    const key = line.slice(0, separator);
    if (!["SF", "LH", "LF", "BRH", "BRF"].includes(key)) continue;
    if (Object.hasOwn(record, key)) fail(`duplicate LCOV field ${key}`);
    record[key] = line.slice(separator + 1);
  }
  return record;
}
export function normalizeLcov(lcov, inventory, revision, repository = process.cwd()) {
  const blocks = lcov.split(/^end_of_record\r?$/m);
  if (blocks.pop().trim()) fail("unterminated LCOV record");
  const records = blocks.map(parseRecord).filter((record) => record.SF);
  const files = records.map((record) => coverageFile(record, path.resolve(repository)));
  const selected = files.filter((file) => inventory.includes(file.path));
  const report = { schemaVersion: 1, revision, tool: "Node V8 LCOV", files: selected };
  checkCoverage(report, inventory);
  return report;
}
function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    if (
      !["--lcov", "--inventory", "--revision", "--output", "--repo"].includes(key) ||
      !args[index + 1] ||
      Object.hasOwn(options, key)
    )
      fail("invalid coverage collector option");
    options[key] = args[index + 1];
  }
  return options;
}
async function collect(options) {
  const [lcov, inventory] = await Promise.all(["--lcov", "--inventory"].map((key) => readFile(options[key], "utf8")));
  const report = normalizeLcov(lcov, JSON.parse(inventory), options["--revision"], options["--repo"]);
  await writeFile(options["--output"], `${JSON.stringify(report, null, 2)}\n`);
  return report;
}
async function main() {
  const options = parseOptions(process.argv.slice(2));
  const report = await collect(options);
  console.log(JSON.stringify(checkCoverage(report, JSON.parse(await readFile(options["--inventory"], "utf8")))));
  if (
    !checkCoverage(
      report,
      report.files.map((file) => file.path),
    ).passed
  )
    process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
