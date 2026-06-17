import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import * as service from './timeslot.service.js';
import type { Request, Response, NextFunction } from 'express';

async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const activeOnly = req.query['all'] !== 'true';
    res.json({ data: await service.listTimeslots(activeOnly) });
  } catch (err) {
    next(err);
  }
}

async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { label, sortOrder = 0 } = req.body as { label: string; sortOrder?: number };
    res.status(201).json({ data: await service.createTimeslot(label, sortOrder) });
  } catch (err) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await service.updateTimeslot(String(req.params['id']), req.body) });
  } catch (err) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await service.deleteTimeslot(String(req.params['id']));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export const timeslotRouter = Router();
timeslotRouter.get('/', list);

export const adminTimeslotRouter = Router();
adminTimeslotRouter.use(auth);
adminTimeslotRouter.get('/', list);
adminTimeslotRouter.post('/', create);
adminTimeslotRouter.patch('/:id', update);
adminTimeslotRouter.delete('/:id', remove);
