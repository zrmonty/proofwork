import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { runHook } from './hook-policy.mjs';

export async function hookCli(args, stream) {
  try {
    if (args.length !== 2 || args[0] !== '--host') throw new Error('invalid hook arguments');
    const chunks = [];
    let bytes = 0;
    for await (const chunk of stream) {
      bytes += Buffer.byteLength(chunk);
      if (bytes > 1048576) throw new Error('hook input limit');
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return await runHook(args[1], JSON.parse(Buffer.concat(chunks).toString('utf8')));
  } catch {
    return { systemMessage: 'Proofwork hook unavailable: inspect binding, payload and local Node runtime. '
      + 'This advisory failure does not establish completion.' };
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  hookCli(process.argv.slice(2), process.stdin).then(output => process.stdout.write(`${JSON.stringify(output)}\n`));
}
