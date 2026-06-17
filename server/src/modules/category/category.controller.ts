import type { Request, Response, NextFunction } from 'express';
import * as categoryService from './category.service.js';

export async function listPublic(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await categoryService.listPublicCategories();
    res.json({ data: categories, meta: { total: categories.length } });
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { categories, total } = await categoryService.listCategories();
    res.json({ data: categories, meta: { total } });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await categoryService.createCategory(req.body.name);
    res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await categoryService.updateCategory(
      req.params['id'] as string,
      req.body.name
    );
    res.json({ data: category });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await categoryService.deleteCategory(req.params['id'] as string);
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
}
