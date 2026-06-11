import type { Request, Response, NextFunction } from 'express';
import * as inquiryService from './inquiry.service.js';
import type { CreateInquiryInput } from './inquiry.schema.js';

export async function createInquiry(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const inquiry = await inquiryService.createInquiry(req.body as CreateInquiryInput);
    res.status(201).json({ data: inquiry });
  } catch (err) {
    next(err);
  }
}
