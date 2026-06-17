import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { uploadMiddleware } from './upload.service.js';
import * as uploadController from './upload.controller.js';

export const adminUploadRouter = Router();

adminUploadRouter.use(auth);
adminUploadRouter.post('/', uploadMiddleware.array('images', 10), uploadController.uploadImages);
