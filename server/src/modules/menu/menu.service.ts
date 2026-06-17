import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';
import { categoryInclude } from '../category/category.service.js';
import type { CreateCakeInput, ListCakesQuery, UpdateCakeInput } from './menu.schema.js';

const cakeInclude = { category: categoryInclude };

export async function listCakes(query: ListCakesQuery) {
  const where = {
    available: true,
    ...(query.category
      ? { category: { OR: [{ slug: query.category }, { name: query.category }] } }
      : {}),
    ...(query.featured ? { featured: true } : {}),
  };

  const cakes = await prisma.cake.findMany({
    where,
    include: cakeInclude,
    orderBy: { createdAt: 'desc' },
  });

  return { cakes, total: cakes.length };
}

export async function listAllCakes() {
  const cakes = await prisma.cake.findMany({
    include: cakeInclude,
    orderBy: { createdAt: 'desc' },
  });
  return { cakes, total: cakes.length };
}

export async function getCakeById(id: string) {
  const cake = await prisma.cake.findUnique({
    where: { id },
    include: cakeInclude,
  });
  if (!cake) {
    throw new AppError(404, `Cake with id "${id}" not found`);
  }
  return cake;
}

async function assertCategoryExists(categoryId: string) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new AppError(400, 'Invalid category');
  }
}

export async function createCake(input: CreateCakeInput) {
  await assertCategoryExists(input.categoryId);
  try {
    return await prisma.cake.create({
      data: input,
      include: cakeInclude,
    });
  } catch {
    throw new AppError(409, 'A cake with this name already exists');
  }
}

export async function updateCake(id: string, input: UpdateCakeInput) {
  await getCakeById(id);
  if (input.categoryId) {
    await assertCategoryExists(input.categoryId);
  }
  try {
    return await prisma.cake.update({
      where: { id },
      data: input,
      include: cakeInclude,
    });
  } catch {
    throw new AppError(409, 'A cake with this name already exists');
  }
}

export async function deleteCake(id: string) {
  await getCakeById(id);
  await prisma.cake.delete({ where: { id } });
}
