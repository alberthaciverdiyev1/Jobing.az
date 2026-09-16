import { ValidationError } from '../Http/Errors/index.js';

export interface ImagePayload {
  bytes: Buffer;
  mimeType: string;
  byteSize: number;
}

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/**
 * File signatures for the formats we accept. The client's `Content-Type` header
 * is trivially spoofed, so the bytes decide — not the header.
 */
const SIGNATURES: { mimeType: string; matches: (bytes: Buffer) => boolean }[] = [
  {
    mimeType: 'image/png',
    matches: (bytes) =>
      bytes.length >= 8 &&
      bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    mimeType: 'image/jpeg',
    matches: (bytes) =>
      bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  {
    mimeType: 'image/webp',
    matches: (bytes) =>
      bytes.length >= 12 &&
      bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
      bytes.subarray(8, 12).toString('ascii') === 'WEBP',
  },
];

/** Returns the real image type, or `null` when the bytes are not a known image. */
export function detectImageType(bytes: Buffer): string | null {
  return SIGNATURES.find((signature) => signature.matches(bytes))?.mimeType ?? null;
}

/** Validates an uploaded image and returns what should be stored. */
export function toImagePayload(bytes: Buffer): ImagePayload {
  if (bytes.length === 0) {
    throw new ValidationError('The uploaded file is empty');
  }

  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new ValidationError(
      `Images must be at most ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB`,
    );
  }

  const mimeType = detectImageType(bytes);
  if (!mimeType) {
    throw new ValidationError('Only PNG, JPEG and WebP images are accepted');
  }

  return { bytes, mimeType, byteSize: bytes.length };
}
