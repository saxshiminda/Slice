import { prisma } from '../../lib/prisma.js';
import type { UpdateDeliverySettingsInput } from './delivery-settings.schema.js';

const DEFAULTS = {
  id: 'singleton' as const,
  minOrderAmount: 0,
  deliveryFee: 5,
  freeDeliveryThreshold: null,
  deliveryAvailable: true,
  pickupAvailable: true,
};

export async function getSettings() {
  const settings = await prisma.deliverySettings.findUnique({ where: { id: 'singleton' } });
  return settings ?? DEFAULTS;
}

export async function updateSettings(input: UpdateDeliverySettingsInput) {
  return prisma.deliverySettings.upsert({
    where: { id: 'singleton' },
    create: { ...DEFAULTS, ...input },
    update: input,
  });
}
