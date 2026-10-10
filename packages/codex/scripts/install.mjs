import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const selector = 'proofwork@proofwork-local';
export function installPlan(host, source = 'zrmonty/proofwork') {
  if (!['codex', 'claude-code'].includes(host)) throw new Error('host must be codex or claude-code');
  if (typeof source !== 'string' || !source.trim() || source.startsWith('-')) {
    throw new Error('source must be a marketplace path or repository');
  }
  const command = host === 'codex' ? 'codex' : 'claude';
  return [
    { command, args: ['plugin', 'marketplace', 'add', source], stage: 'marketplace registration' },
    { command, args: ['plugin', host === 'codex' ? 'add' : 'install', selector], stage: 'plugin installation' },
    { command, args: ['plugin', 'list', '--json'], stage: 'installation verification' },
  ];
}

export function cliInvocation(command, args, cli) {
  if (cli === undefined) return { command, args };
  if (typeof cli !== 'string' || !cli.trim() || cli.startsWith('-') || cli.includes('\0'))
    throw new Error('cli must be an executable path or Node entry file');
  if (/\.(?:cmd|bat|ps1)$/i.test(cli))
    throw new Error('cli shell wrappers are unsupported; supply the native executable or Node entry file');
  const entry = path.resolve(cli);
  return /\.(?:mjs|cjs|js)$/i.test(entry)
    ? { command: process.execPath, args: [entry, ...args] } : { command: entry, args };
}
export function install({ host, source, cli }, run = spawnSync) {
  const plan = installPlan(host, source);
  let output;
  for (const step of plan) {
    const invocation = cliInvocation(step.command, step.args, cli);
    const result = run(invocation.command, invocation.args, {
      shell: false, encoding: 'utf8', timeout: 120000, maxBuffer: 4 * 1024 * 1024,
    });
    if (result.status !== 0) {
      const reason = result.error?.code ?? `exit ${result.status}`;
      throw new Error(`${host} ${step.stage} failed (${reason}). Check the native CLI, network and host policy; ` +
        'Use --cli PATH for a native executable or Node entry file; retry after resolving it. No later step ran.');
    }
    output = result.stdout;
  }
  let listing;
  try { listing = JSON.parse(output); } catch { throw new Error('installation verification returned invalid JSON'); }
  const entries = host === 'codex' ? listing.installed : listing;
  const plugin = Array.isArray(entries) && entries.find(item => (item.pluginId ?? item.id) === selector);
  const version = plugin?.readFromFolder ? plugin.folderVersion : plugin?.version;
  if (!plugin || plugin.enabled !== true || !/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(version)) {
    throw new Error('installation verification did not show an enabled Proofwork with a known version. ' +
      'Inspect the host plugin list; an existing disabled policy was not overridden.');
  }
  return { host, version, verified: true,
    nextPrompt: host === 'codex' ? '$use-proofwork <your outcome>' : '/proofwork:use-proofwork <your outcome>',
    note: 'Start a fresh host session. No model setup, project policy or lifecycle hooks were configured.' };
}

export function parseInstallArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    if (!['--host', '--source', '--cli'].includes(name) || !args[index + 1] || Object.hasOwn(options, name.slice(2))) {
      throw new Error('options require unique --host, --source or --cli value pairs');
    }
    options[name.slice(2)] = args[index + 1];
  }
  installPlan(options.host, options.source);
  cliInvocation('host', [], options.cli);
  return options;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(install(parseInstallArgs(process.argv.slice(2))), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
