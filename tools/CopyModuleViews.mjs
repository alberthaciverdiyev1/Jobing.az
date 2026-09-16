#!/usr/bin/env node
/**
 * Module views live inside `src/Modules/<Name>/Views` next to their code, so
 * `tsc` ignores them. This copies the whole tree into `dist/` after a build.
 */
import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src', 'Modules');
const target = path.join(root, 'dist', 'Modules');

async function isDirectory(candidate) {
  try {
    return (await stat(candidate)).isDirectory();
  } catch {
    return false;
  }
}

let copied = 0;

for (const entry of await readdir(source)) {
  const views = path.join(source, entry, 'Views');
  if (!(await isDirectory(views))) continue;

  const destination = path.join(target, entry, 'Views');
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(views, destination, { recursive: true });
  copied += 1;
}

console.log(`Copied views for ${copied} module(s) into dist/`);
