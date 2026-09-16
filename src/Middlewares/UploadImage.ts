import type { RequestHandler } from 'express';
import multer from 'multer';
import { ValidationError } from '../Core/Http/Errors/index.js';
import { MAX_IMAGE_BYTES } from '../Core/Support/ImagePayload.js';

const MAX_IMAGE_MB = Math.round(MAX_IMAGE_BYTES / 1024 / 1024);

/**
 * Buffers a single image upload into memory. Nothing is written to disk here:
 * the handler validates the bytes first and then stores what it accepted.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 10 },
}).single('file');

export const uploadImage: RequestHandler = (req, res, next) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      next(
        new ValidationError(
          error.code === 'LIMIT_FILE_SIZE'
            ? `Images must be at most ${MAX_IMAGE_MB} MB`
            : `Upload rejected: ${error.message}`,
        ),
      );
      return;
    }

    next(error);
  });
};
