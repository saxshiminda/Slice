import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';
import { createPayment, verifyPayment } from '../payment/payment.service.js';
import {
  sendOrderConfirmationToCustomer,
  sendNewOrderAlertToBakery,
} from '../email/email.service.js';
import type { CreateShopOrderInput } from './shop-order.schema.js';

const shopOrderInclude = {
  items: { include: { cake: { select: { id: true, name: true, imageUrl: true } } } },
  branch: true,
  customer: { select: { id: true, name: true, email: true } },
} as const;

export async function initiateCheckout(input: CreateShopOrderInput, customerId?: string) {
  // 1. Validate all cakes exist and are available
  const cakeIds = [...new Set(input.items.map((i) => i.cakeId))];
  const cakes = await prisma.cake.findMany({
    where: { id: { in: cakeIds }, available: true },
    select: { id: true, name: true, price: true },
  });
  if (cakes.length !== cakeIds.length) {
    throw new AppError(400, 'One or more items are unavailable');
  }
  const cakeMap = new Map(cakes.map((c) => [c.id, c]));

  // 2. Recalculate totals server-side (never trust client prices for final billing)
  const deliverySettings = await prisma.deliverySettings.findUnique({
    where: { id: 'singleton' },
  });

  const subtotal = input.items.reduce((sum, item) => {
    const cake = cakeMap.get(item.cakeId);
    if (!cake) throw new AppError(400, `Cake ${item.cakeId} not found`);
    // Use server-side price; client unit price is informational only
    return sum + cake.price * item.quantity;
  }, 0);

  let deliveryFee = 0;
  if (input.fulfillmentType === 'DELIVERY' && deliverySettings) {
    const threshold = deliverySettings.freeDeliveryThreshold;
    deliveryFee =
      threshold !== null && threshold !== undefined && subtotal >= threshold
        ? 0
        : deliverySettings.deliveryFee;
  }

  const minOrder = deliverySettings?.minOrderAmount ?? 0;
  if (subtotal < minOrder) {
    throw new AppError(400, `Minimum order amount is ₾${minOrder.toFixed(2)}`);
  }

  const total = subtotal + deliveryFee;

  // 3. Create a PENDING order
  const order = await prisma.shopOrder.create({
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      fulfillmentType: input.fulfillmentType,
      subtotal,
      deliveryFee,
      total,
      notes: input.notes,
      pickupDate: input.pickupDate ? new Date(input.pickupDate) : undefined,
      pickupSlot: input.pickupSlot,
      deliveryAddress: input.deliveryAddress,
      branchId: input.branchId || undefined,
      customerId: customerId || undefined,
      status: 'PENDING',
      items: {
        create: input.items.map((item) => {
          const cake = cakeMap.get(item.cakeId)!;
          const unitPrice = cake.price;
          return {
            cakeId: item.cakeId,
            cakeName: cake.name,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice,
            total: unitPrice * item.quantity,
          };
        }),
      },
    },
    include: shopOrderInclude,
  });

  // 4. Create payment session
  const description = `Slice order #${order.id.slice(-6).toUpperCase()}`;
  const payment = await createPayment({
    orderId: order.id,
    totalGel: total,
    description,
  });

  // 5. Store the payment ID on the order
  await prisma.shopOrder.update({
    where: { id: order.id },
    data: { paymentId: payment.paymentId },
  });

  return { orderId: order.id, redirectUrl: payment.redirectUrl };
}

export async function handlePaymentCallback(orderId: string, statusParam: string) {
  const order = await prisma.shopOrder.findUnique({
    where: { id: orderId },
    include: shopOrderInclude,
  });

  if (!order) throw new AppError(404, 'Order not found');
  if (order.status !== 'PENDING') return order; // idempotent

  if (statusParam === 'fail') {
    await prisma.shopOrder.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
    return { ...order, status: 'CANCELLED' as const };
  }

  // Verify with gateway
  const paymentStatus = order.paymentId
    ? await verifyPayment(order.paymentId)
    : { paid: false, status: 'UNKNOWN', paymentId: '' };

  if (!paymentStatus.paid) {
    return order; // still pending — don't mark as paid
  }

  const updated = await prisma.shopOrder.update({
    where: { id: orderId },
    data: { status: 'PAID' },
    include: shopOrderInclude,
  });

  // Fire emails in background (non-blocking)
  void sendOrderConfirmationToCustomer({
    id: updated.id,
    customerName: updated.customerName,
    customerEmail: updated.customerEmail,
    total: updated.total,
    items: updated.items.map((i) => ({
      cakeName: i.cakeName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  }).catch(console.error);

  void sendNewOrderAlertToBakery({
    id: updated.id,
    customerName: updated.customerName,
    customerEmail: updated.customerEmail,
    customerPhone: updated.customerPhone,
    total: updated.total,
    fulfillmentType: updated.fulfillmentType,
    items: updated.items.map((i) => ({ cakeName: i.cakeName, quantity: i.quantity })),
  }).catch(console.error);

  return updated;
}

export async function handleWebhook(payload: unknown) {
  // BoG webhook payload — extract orderId and status
  const p = payload as Record<string, unknown>;
  const externalOrderId = (p['external_order_id'] ?? p['orderId']) as string | undefined;
  const statusKey =
    ((p['order_status'] as Record<string, unknown> | undefined)?.['key'] as string | undefined) ??
    (p['status'] as string | undefined);

  if (!externalOrderId || statusKey !== 'completed') return { received: true };

  await handlePaymentCallback(externalOrderId, 'success');
  return { received: true };
}

export async function getOrder(id: string) {
  const order = await prisma.shopOrder.findUnique({
    where: { id },
    include: shopOrderInclude,
  });
  if (!order) throw new AppError(404, 'Order not found');
  return order;
}

export async function listShopOrders(status?: string) {
  const where = status
    ? { status: status as 'PENDING' | 'PAID' | 'CONFIRMED' | 'READY' | 'DELIVERED' | 'CANCELLED' }
    : {};
  const orders = await prisma.shopOrder.findMany({
    where,
    include: shopOrderInclude,
    orderBy: { createdAt: 'desc' },
  });
  return { orders, total: orders.length };
}

export async function updateOrderStatus(id: string, status: string) {
  const order = await prisma.shopOrder.findUnique({ where: { id } });
  if (!order) throw new AppError(404, 'Order not found');
  return prisma.shopOrder.update({
    where: { id },
    data: {
      status: status as 'PENDING' | 'PAID' | 'CONFIRMED' | 'READY' | 'DELIVERED' | 'CANCELLED',
    },
    include: shopOrderInclude,
  });
}

export async function getCustomerOrders(customerId: string) {
  return prisma.shopOrder.findMany({
    where: { customerId },
    include: shopOrderInclude,
    orderBy: { createdAt: 'desc' },
  });
}
