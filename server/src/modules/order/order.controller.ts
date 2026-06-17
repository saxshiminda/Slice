import type { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service.js';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orders, total } = await orderService.listOrders();
    res.json({ data: orders, meta: { total } });
  } catch (err) {
    next(err);
  }
}
