import type { Request, Response, NextFunction } from 'express';
import * as branchService from './branch.service.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const activeOnly = req.query['all'] !== 'true';
    const branches = await branchService.listBranches(activeOnly);
    res.json({ data: branches });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const branch = await branchService.createBranch(req.body);
    res.status(201).json({ data: branch });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const branch = await branchService.updateBranch(String(req.params['id']), req.body);
    res.json({ data: branch });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await branchService.deleteBranch(String(req.params['id']));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
