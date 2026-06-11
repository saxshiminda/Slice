import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';
import type { ListCakesQuery } from './menu.schema.js';

export async function listCakes(query: ListCakesQuery) {
  const where = {
    available: true,
    ...(query.category ? { category: query.category } : {}),
    ...(query.featured ? { featured: true } : {}),
  };

  const cakes = await prisma.cake.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return { cakes, total: cakes.length };
}

export async function getCakeById(id: string) {
  const cake = await prisma.cake.findUnique({ where: { id } });
  if (!cake) {
    throw new AppError(404, `Cake with id "${id}" not found`);
  }
  return cake;
}
