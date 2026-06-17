import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { optionalCustomerAuth } from '../../middleware/customer-auth.js';
import { createShopOrderSchema, updateShopOrderStatusSchema } from './shop-order.schema.js';
import * as ctrl from './shop-order.controller.js';

// Public routes
export const shopOrderRouter = Router();

shopOrderRouter.post(
  '/checkout',
  optionalCustomerAuth,
  validate(createShopOrderSchema),
  ctrl.checkout
);
shopOrderRouter.get('/callback', ctrl.paymentCallback);
shopOrderRouter.post('/webhook', ctrl.paymentWebhook);
shopOrderRouter.get('/:id', ctrl.getOrder);

// Admin routes
export const adminShopOrderRouter = Router();
adminShopOrderRouter.use(auth);
adminShopOrderRouter.get('/', ctrl.listAdmin);
adminShopOrderRouter.patch('/:id/status', validate(updateShopOrderStatusSchema), ctrl.updateStatus);
