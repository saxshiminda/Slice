import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireCustomerAuth } from '../../middleware/customer-auth.js';
import {
  registerCustomerSchema,
  loginCustomerSchema,
  updateCustomerSchema,
} from './customer.schema.js';
import * as ctrl from './customer.controller.js';

export const customerRouter = Router();

customerRouter.post('/register', validate(registerCustomerSchema), ctrl.register);
customerRouter.post('/login', validate(loginCustomerSchema), ctrl.login);
customerRouter.get('/me', requireCustomerAuth, ctrl.me);
customerRouter.patch('/me', requireCustomerAuth, validate(updateCustomerSchema), ctrl.updateMe);
customerRouter.get('/me/orders', requireCustomerAuth, ctrl.myOrders);
