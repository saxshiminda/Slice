import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { createCategorySchema, updateCategorySchema } from './category.schema.js';
import * as categoryController from './category.controller.js';

export const categoryRouter = Router();

categoryRouter.get('/', categoryController.listPublic);

export const adminCategoryRouter = Router();
adminCategoryRouter.use(auth);
adminCategoryRouter.get('/', categoryController.listAdmin);
adminCategoryRouter.post('/', validate(createCategorySchema), categoryController.create);
adminCategoryRouter.patch('/:id', validate(updateCategorySchema), categoryController.update);
adminCategoryRouter.delete('/:id', categoryController.remove);
