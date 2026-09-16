import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { paths } from '../../Config/Paths.js';
import type { ImagePayload } from '../Support/ImagePayload.js';

/** Everything uploaded lives under `public/images`, served by `/static/images/…`. */
const IMAGE_ROOT = path.join(paths.public, 'images');

const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

/**
 * Writes an image and returns its path relative to `public/`.
 *
 * The file name carries a digest of the bytes, so replacing an image produces a
 * new URL — browsers can cache the old one forever without ever showing stale
 * content.
 */
export async function storeImage(
  folder: string,
  basename: string,
  image: ImagePayload,
): Promise<string> {
  const extension = EXTENSIONS[image.mimeType] ?? 'bin';
  const digest = createHash('sha1').update(image.bytes).digest('hex').slice(0, 12);
  const fileName = `${basename}-${digest}.${extension}`;

  await fs.mkdir(path.join(IMAGE_ROOT, folder), { recursive: true });
  await fs.writeFile(path.join(IMAGE_ROOT, folder, fileName), image.bytes);

  return path.posix.join('images', folder, fileName);
}

/** Removes a stored image. Missing files are not an error. */
export async function deleteImage(relativePath: string): Promise<void> {
  const absolute = path.resolve(paths.public, relativePath);

  // Never touch anything outside `public/`, whatever the database says.
  if (absolute !== paths.public && !absolute.startsWith(paths.public + path.sep)) return;

  await fs.rm(absolute, { force: true });
}

/** Public URL for a stored image path. */
export function imageUrl(relativePath: string | null): string | null {
  return relativePath ? `/static/${relativePath}` : null;
}
