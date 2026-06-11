import type { Request, Response, NextFunction } from 'express';
import * as menuService from './menu.service.js';
import type { ListCakesQuery } from './menu.schema.js';

export async function listCakes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { cakes, total } = await menuService.listCakes(req.query as unknown as ListCakesQuery);
    res.json({ data: cakes, meta: { total } });
  } catch (err) {
    next(err);
  }
}

export async function getCake(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cake = await menuService.getCakeById(req.params['id'] as string);
    res.json({ data: cake });
  } catch (err) {
    next(err);
  }
}
