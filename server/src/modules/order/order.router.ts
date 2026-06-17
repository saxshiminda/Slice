import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { createOrderSchema } from './order.schema.js';
import * as orderController from './order.controller.js';

export const orderRouter = Router();

orderRouter.post('/', validate(createOrderSchema), orderController.create);

export const adminOrderRouter = Router();
adminOrderRouter.use(auth);
adminOrderRouter.get('/', orderController.listAdmin);
