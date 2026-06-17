import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';
import type { CreateBranchInput, UpdateBranchInput } from './branch.schema.js';

export async function listBranches(activeOnly = true) {
  return prisma.branch.findMany({
    where: activeOnly ? { active: true } : {},
    orderBy: { name: 'asc' },
  });
}

export async function createBranch(input: CreateBranchInput) {
  return prisma.branch.create({ data: input });
}

export async function updateBranch(id: string, input: UpdateBranchInput) {
  const branch = await prisma.branch.findUnique({ where: { id } });
  if (!branch) throw new AppError(404, 'Branch not found');
  return prisma.branch.update({ where: { id }, data: input });
}

export async function deleteBranch(id: string) {
  const branch = await prisma.branch.findUnique({ where: { id } });
  if (!branch) throw new AppError(404, 'Branch not found');
  await prisma.branch.delete({ where: { id } });
}
