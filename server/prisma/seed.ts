import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cakes = [
  {
    name: 'Grand Ivory Wedding Cake',
    description:
      'A towering five-tier masterpiece in ivory fondant, hand-piped with delicate lace work and fresh ivory roses. Vanilla bean sponge with elderflower buttercream.',
    price: 850,
    category: 'Wedding',
    imageUrl: 'https://picsum.photos/seed/grand-ivory-wedding/600/400',
    featured: true,
    available: true,
  },
  {
    name: 'Blush Peony Wedding Cake',
    description:
      'A romantic three-tier cake dressed in dusty rose buttercream with sculpted sugar peonies cascading down the side. Champagne sponge with raspberry conserve.',
    price: 620,
    category: 'Wedding',
    imageUrl: 'https://picsum.photos/seed/blush-peony-wedding/600/400',
    featured: false,
    available: true,
  },
  {
    name: 'Golden Birthday Celebration',
    description:
      'A bold two-tier cake finished in a deep gold leaf texture with hand-painted florals. Rich chocolate sponge filled with salted caramel ganache.',
    price: 195,
    category: 'Birthday',
    imageUrl: 'https://picsum.photos/seed/golden-birthday/600/400',
    featured: true,
    available: true,
  },
  {
    name: 'Whimsical Rainbow Smash',
    description:
      'A vibrant four-layer rainbow cake with clouds of vanilla Swiss meringue buttercream and rainbow sprinkle drip. Perfect for first birthdays and joyful celebrations.',
    price: 145,
    category: 'Birthday',
    imageUrl: 'https://picsum.photos/seed/rainbow-smash/600/400',
    featured: false,
    available: true,
  },
  {
    name: 'Autumn Spiced Harvest',
    description:
      'A seasonally inspired cake with layers of warming cinnamon, cardamom, and apple. Finished with a rustic cream cheese frost and dried orange slices.',
    price: 165,
    category: 'Seasonal',
    imageUrl: 'https://picsum.photos/seed/autumn-harvest/600/400',
    featured: true,
    available: true,
  },
  {
    name: 'Strawberry Midsummer',
    description:
      'Light as air — a génoise sponge with layers of fresh Kentish strawberries and crème diplomate, topped with a crown of seasonal berries.',
    price: 155,
    category: 'Seasonal',
    imageUrl: 'https://picsum.photos/seed/strawberry-midsummer/600/400',
    featured: false,
    available: true,
  },
  {
    name: 'Bespoke Portrait Cake',
    description:
      'A fully custom-designed cake built around your vision. We work with you on every detail — flavours, tiers, colour palette, and any sculptural elements.',
    price: 450,
    category: 'Custom',
    imageUrl: 'https://picsum.photos/seed/bespoke-portrait/600/400',
    featured: false,
    available: true,
  },
  {
    name: 'Floral Cascade Custom',
    description:
      'A custom three-tier cake draped in hand-crafted sugar florals designed to match your event palette exactly. Flavours and colours chosen at consultation.',
    price: 520,
    category: 'Custom',
    imageUrl: 'https://picsum.photos/seed/floral-cascade-custom/600/400',
    featured: false,
    available: true,
  },
  {
    name: 'Winter Spice Wedding',
    description:
      'A seasonal wedding cake with warming ginger and dark chocolate sponge, iced in a bone-white textured buttercream with sprigs of frosted rosemary and cranberry.',
    price: 710,
    category: 'Wedding',
    imageUrl: 'https://picsum.photos/seed/winter-spice-wedding/600/400',
    featured: false,
    available: true,
  },
];

async function main() {
  console.log('Seeding database...');

  for (const cake of cakes) {
    await prisma.cake.upsert({
      where: { name: cake.name },
      update: cake,
      create: cake,
    });
  }

  console.log(`Seeded ${cakes.length} cakes.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
