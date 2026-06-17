import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';
import { categoryInclude } from '../category/category.service.js';
import type {
  CreateCakeInput,
  ListCakesQuery,
  UpdateCakeInput,
  CreateVariantInput,
  UpdateVariantInput,
} from './menu.schema.js';

const cakeInclude = {
  category: categoryInclude,
  variants: { where: { active: true }, orderBy: { price: 'asc' as const } },
};

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

// ─── Product variants ─────────────────────────────────────────────────────────

export async function listVariants(cakeId: string) {
  await getCakeById(cakeId);
  return prisma.productVariant.findMany({
    where: { cakeId },
    orderBy: { price: 'asc' },
  });
}

export async function createVariant(cakeId: string, input: CreateVariantInput) {
  await getCakeById(cakeId);
  return prisma.productVariant.create({ data: { ...input, cakeId } });
}

export async function updateVariant(cakeId: string, id: string, input: UpdateVariantInput) {
  await getCakeById(cakeId);
  const variant = await prisma.productVariant.findFirst({ where: { id, cakeId } });
  if (!variant) throw new AppError(404, 'Variant not found');
  return prisma.productVariant.update({ where: { id }, data: input });
}

export async function deleteVariant(cakeId: string, id: string) {
  await getCakeById(cakeId);
  const variant = await prisma.productVariant.findFirst({ where: { id, cakeId } });
  if (!variant) throw new AppError(404, 'Variant not found');
  await prisma.productVariant.delete({ where: { id } });
}
