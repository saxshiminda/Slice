import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { createInquirySchema } from './inquiry.schema.js';
import * as inquiryController from './inquiry.controller.js';

export const inquiryRouter = Router();

inquiryRouter.post('/', validate(createInquirySchema), inquiryController.createInquiry);

export const adminInquiryRouter = Router();
adminInquiryRouter.use(auth);
adminInquiryRouter.get('/', inquiryController.listInquiries);
