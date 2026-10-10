import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function isMain(moduleUrl, entry = process.argv[1]) {
  if (!entry) return false;
  try { return realpathSync(fileURLToPath(moduleUrl)) === realpathSync(resolve(entry)); }
  catch { return false; }
}
