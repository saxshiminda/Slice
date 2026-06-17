import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';

export async function listTimeslots(activeOnly = true) {
  return prisma.timeSlot.findMany({
    where: activeOnly ? { active: true } : {},
    orderBy: { sortOrder: 'asc' },
  });
}

export async function createTimeslot(label: string, sortOrder: number) {
  return prisma.timeSlot.create({ data: { label, sortOrder } });
}

export async function updateTimeslot(
  id: string,
  input: { label?: string; active?: boolean; sortOrder?: number }
) {
  const slot = await prisma.timeSlot.findUnique({ where: { id } });
  if (!slot) throw new AppError(404, 'Time slot not found');
  return prisma.timeSlot.update({ where: { id }, data: input });
}

export async function deleteTimeslot(id: string) {
  const slot = await prisma.timeSlot.findUnique({ where: { id } });
  if (!slot) throw new AppError(404, 'Time slot not found');
  await prisma.timeSlot.delete({ where: { id } });
}
