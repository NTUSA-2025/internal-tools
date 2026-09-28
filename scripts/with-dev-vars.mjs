import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

const [, , command, ...args] = process.argv;

if (!command) {
  console.error('Usage: node scripts/with-dev-vars.mjs <command> [...args]');
  process.exit(1);
}

const varsPath = existsSync('.dev.vars.local')
  ? '.dev.vars.local'
  : '.dev.vars';

if (existsSync(varsPath)) {
  const vars = parseDevVars(readFileSync(varsPath, 'utf8'));

  for (const [key, value] of Object.entries(vars)) {
    process.env[key] = value;
  }
}

const child = spawn(command, args, {
  env: process.env,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

function parseDevVars(source) {
  const vars = {};

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (!key) {
      continue;
    }

    vars[key] = stripQuotes(rawValue);
  }

  return vars;
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
