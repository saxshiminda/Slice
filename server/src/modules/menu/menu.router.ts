import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { listCakesQuerySchema } from './menu.schema.js';
import * as menuController from './menu.controller.js';

export const menuRouter = Router();

menuRouter.get('/', validate(listCakesQuerySchema, 'query'), menuController.listCakes);
menuRouter.get('/:id', menuController.getCake);
