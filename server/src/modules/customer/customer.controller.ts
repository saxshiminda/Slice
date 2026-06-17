import type { Request, Response, NextFunction } from 'express';
import * as customerService from './customer.service.js';
import { getCustomerOrders } from '../shop-order/shop-order.service.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await customerService.registerCustomer(req.body);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await customerService.loginCustomer(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const customer = await customerService.getCustomerById(req.customerId!);
    res.json({ data: customer });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const customer = await customerService.updateCustomer(req.customerId!, req.body);
    res.json({ data: customer });
  } catch (err) {
    next(err);
  }
}

export async function myOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await getCustomerOrders(req.customerId!);
    res.json({ data: orders, meta: { total: orders.length } });
  } catch (err) {
    next(err);
  }
}
