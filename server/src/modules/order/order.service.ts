import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';
import { categoryInclude } from '../category/category.service.js';
import type { CreateOrderInput } from './order.schema.js';

const orderInclude = {
  category: categoryInclude,
};

export async function createOrder(input: CreateOrderInput) {
  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw new AppError(400, 'Invalid category');
    }
  }

  return prisma.order.create({
    data: input,
    include: orderInclude,
  });
}

export async function listOrders() {
  const orders = await prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });
  return { orders, total: orders.length };
}
