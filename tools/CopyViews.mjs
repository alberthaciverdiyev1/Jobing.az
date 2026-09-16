#!/usr/bin/env node
/**
 * Templates live in `src/Views` next to the code, so `tsc` ignores them.
 * This copies the tree into `dist/` after a build.
 */
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src', 'Views');
const target = path.join(root, 'dist', 'Views');

await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

console.log('Copied views into dist/');
