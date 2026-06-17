import type { Request, Response, NextFunction } from 'express';
import { filesToUrls } from './upload.service.js';
import { AppError } from '../../middleware/app-error.js';

export function uploadImages(req: Request, res: Response, next: NextFunction): void {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      next(new AppError(400, 'No images uploaded'));
      return;
    }
    const urls = filesToUrls(files.map((f) => f.filename));
    res.status(201).json({ data: { urls } });
  } catch (err) {
    next(err);
  }
}
