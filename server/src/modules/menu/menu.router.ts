import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { listCakesQuerySchema, createCakeSchema, updateCakeSchema } from './menu.schema.js';
import * as menuController from './menu.controller.js';

export const menuRouter = Router();

menuRouter.get('/', validate(listCakesQuerySchema, 'query'), menuController.listCakes);
menuRouter.get('/:id', menuController.getCake);

export const adminCakeRouter = Router();
adminCakeRouter.use(auth);
adminCakeRouter.get('/', menuController.listAllCakes);
adminCakeRouter.post('/', validate(createCakeSchema), menuController.createCake);
adminCakeRouter.patch('/:id', validate(updateCakeSchema), menuController.updateCake);
adminCakeRouter.delete('/:id', menuController.removeCake);
