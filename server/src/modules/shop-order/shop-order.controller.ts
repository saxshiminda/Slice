import type { Request, Response, NextFunction } from 'express';
import * as shopOrderService from './shop-order.service.js';

export async function checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const customerId = (req as Request & { customerId?: string }).customerId;
    const result = await shopOrderService.initiateCheckout(req.body, customerId);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function paymentCallback(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { orderId, status } = req.query as { orderId?: string; status?: string };
    if (!orderId) {
      res.status(400).json({ error: 'Missing orderId' });
      return;
    }
    const order = await shopOrderService.handlePaymentCallback(orderId, status ?? 'unknown');
    const clientUrl = process.env['CLIENT_URL'] ?? 'http://localhost:5173';
    if (order.status === 'CANCELLED') {
      res.redirect(`${clientUrl}/checkout?payment=failed`);
      return;
    }
    res.redirect(`${clientUrl}/order-confirmation/${order.id}`);
  } catch (err) {
    next(err);
  }
}

export async function paymentWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await shopOrderService.handleWebhook(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await shopOrderService.getOrder(String(req.params['id']));
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = req.query as { status?: string };
    const { orders, total } = await shopOrderService.listShopOrders(status);
    res.json({ data: orders, meta: { total } });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await shopOrderService.updateOrderStatus(
      String(req.params['id']),
      req.body.status
    );
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
}
