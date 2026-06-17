import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const img = (slug: string) => `/images/cakes/${slug}.jpg`;

const defaultCategories = [
  { name: 'Wedding', slug: 'wedding' },
  { name: 'Birthday', slug: 'birthday' },
  { name: 'Seasonal', slug: 'seasonal' },
  { name: 'Custom', slug: 'custom' },
];

const cakes = [
  {
    name: 'Grand Ivory Wedding Cake',
    description:
      'A towering five-tier masterpiece in ivory fondant, hand-piped with delicate lace work and fresh ivory roses. Vanilla bean sponge with elderflower buttercream.',
    price: 850,
    categorySlug: 'wedding',
    imageUrl: img('grand-ivory-wedding'),
    featured: true,
    available: true,
  },
  {
    name: 'Blush Peony Wedding Cake',
    description:
      'A romantic three-tier cake dressed in dusty rose buttercream with sculpted sugar peonies cascading down the side. Champagne sponge with raspberry conserve.',
    price: 620,
    categorySlug: 'wedding',
    imageUrl: img('blush-peony-wedding'),
    featured: false,
    available: true,
  },
  {
    name: 'Golden Birthday Celebration',
    description:
      'A bold two-tier cake finished in a deep gold leaf texture with hand-painted florals. Rich chocolate sponge filled with salted caramel ganache.',
    price: 195,
    categorySlug: 'birthday',
    imageUrl: img('golden-birthday-celebration'),
    featured: true,
    available: true,
  },
  {
    name: 'Whimsical Rainbow Smash',
    description:
      'A vibrant four-layer rainbow cake with clouds of vanilla Swiss meringue buttercream and rainbow sprinkle drip. Perfect for first birthdays and joyful celebrations.',
    price: 145,
    categorySlug: 'birthday',
    imageUrl: img('whimsical-rainbow-smash'),
    featured: false,
    available: true,
  },
  {
    name: 'Autumn Spiced Harvest',
    description:
      'A seasonally inspired cake with layers of warming cinnamon, cardamom, and apple. Finished with a rustic cream cheese frost and dried orange slices.',
    price: 165,
    categorySlug: 'seasonal',
    imageUrl: img('autumn-spiced-harvest'),
    featured: true,
    available: true,
  },
  {
    name: 'Strawberry Midsummer',
    description:
      'Light as air — a génoise sponge with layers of fresh Kentish strawberries and crème diplomate, topped with a crown of seasonal berries.',
    price: 155,
    categorySlug: 'seasonal',
    imageUrl: img('strawberry-midsummer'),
    featured: false,
    available: true,
  },
  {
    name: 'Bespoke Portrait Cake',
    description:
      'A fully custom-designed cake built around your vision. We work with you on every detail — flavours, tiers, colour palette, and any sculptural elements.',
    price: 450,
    categorySlug: 'custom',
    imageUrl: img('bespoke-portrait-cake'),
    featured: false,
    available: true,
  },
  {
    name: 'Floral Cascade Custom',
    description:
      'A custom three-tier cake draped in hand-crafted sugar florals designed to match your event palette exactly. Flavours and colours chosen at consultation.',
    price: 520,
    categorySlug: 'custom',
    imageUrl: img('floral-cascade-custom'),
    featured: false,
    available: true,
  },
  {
    name: 'Winter Spice Wedding',
    description:
      'A seasonal wedding cake with warming ginger and dark chocolate sponge, iced in a bone-white textured buttercream with sprigs of frosted rosemary and cranberry.',
    price: 710,
    categorySlug: 'wedding',
    imageUrl: img('winter-spice-wedding'),
    featured: false,
    available: true,
  },
];

async function main() {
  console.log('Seeding database...');

  const categoryMap = new Map<string, string>();

  for (const cat of defaultCategories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoryMap.set(cat.slug, category.id);
  }

  for (const cake of cakes) {
    const categoryId = categoryMap.get(cake.categorySlug);
    if (!categoryId) throw new Error(`Missing category: ${cake.categorySlug}`);

    const { categorySlug: _, ...data } = cake;
    await prisma.cake.upsert({
      where: { name: cake.name },
      update: { ...data, categoryId },
      create: { ...data, categoryId },
    });
  }

  console.log(`Seeded ${defaultCategories.length} categories and ${cakes.length} cakes.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
