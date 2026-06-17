import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { updateDeliverySettingsSchema } from './delivery-settings.schema.js';
import * as service from './delivery-settings.service.js';
import type { Request, Response, NextFunction } from 'express';

async function getHandler(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await service.getSettings() });
  } catch (err) {
    next(err);
  }
}

async function updateHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await service.updateSettings(req.body) });
  } catch (err) {
    next(err);
  }
}

export const deliverySettingsRouter = Router();
deliverySettingsRouter.get('/', getHandler);

export const adminDeliverySettingsRouter = Router();
adminDeliverySettingsRouter.use(auth);
adminDeliverySettingsRouter.get('/', getHandler);
adminDeliverySettingsRouter.patch('/', validate(updateDeliverySettingsSchema), updateHandler);
