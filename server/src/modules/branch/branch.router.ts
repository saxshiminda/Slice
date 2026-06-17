import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { createBranchSchema, updateBranchSchema } from './branch.schema.js';
import * as ctrl from './branch.controller.js';

export const branchRouter = Router();
branchRouter.get('/', ctrl.list);

export const adminBranchRouter = Router();
adminBranchRouter.use(auth);
adminBranchRouter.get('/', ctrl.list);
adminBranchRouter.post('/', validate(createBranchSchema), ctrl.create);
adminBranchRouter.patch('/:id', validate(updateBranchSchema), ctrl.update);
adminBranchRouter.delete('/:id', ctrl.remove);
