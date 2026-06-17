import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const categoryInclude = {
  select: { id: true, name: true, slug: true },
} as const;

export async function listCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { cakes: true } } },
  });
  return { categories, total: categories.length };
}

export async function listPublicCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  });
  return categories;
}

export async function createCategory(name: string) {
  const slug = slugify(name);
  const existing = await prisma.category.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (existing) {
    throw new AppError(409, 'A category with this name already exists');
  }
  return prisma.category.create({ data: { name, slug } });
}

export async function updateCategory(id: string, name: string) {
  const slug = slugify(name);
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name }, { slug }],
      NOT: { id },
    },
  });
  if (existing) {
    throw new AppError(409, 'A category with this name already exists');
  }

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  return prisma.category.update({
    where: { id },
    data: { name, slug },
  });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { cakes: true } } },
  });
  if (!category) {
    throw new AppError(404, 'Category not found');
  }
  if (category._count.cakes > 0) {
    throw new AppError(400, 'Cannot delete a category that has cakes assigned');
  }
  await prisma.category.delete({ where: { id } });
}

export { categoryInclude };
