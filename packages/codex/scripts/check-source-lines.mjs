import { isMain } from './runtime-entry.mjs';
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export function longLines(text, limit = 120) {
  if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("invalid source-line limit");
  return text
    .split(/\r?\n/)
    .flatMap((line, index) => (line.length > limit ? [{ line: index + 1, length: line.length }] : []));
}
export async function checkSourceLines(repository, names, limit = 120) {
  const files =
    names ??
    (await readdir(path.join(repository, "scripts")))
      .filter((name) => name.endsWith(".mjs"))
      .map((name) => `scripts/${name}`);
  const reports = await Promise.all(
    files.map(async (file) => ({
      path: file,
      violations: longLines(await readFile(path.join(repository, file), "utf8"), limit),
    })),
  );
  return { passed: reports.every((file) => !file.violations.length), limit, files: reports };
}
if (isMain(import.meta.url)) {
  checkSourceLines(process.cwd())
    .then((report) => {
      console.log(JSON.stringify(report, null, 2));
      if (!report.passed) process.exitCode = 1;
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
