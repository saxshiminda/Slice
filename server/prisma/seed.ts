import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&h=400&q=80`;

const cakes = [
  {
    name: 'Grand Ivory Wedding Cake',
    description:
      'A towering five-tier masterpiece in ivory fondant, hand-piped with delicate lace work and fresh ivory roses. Vanilla bean sponge with elderflower buttercream.',
    price: 850,
    category: 'Wedding',
    imageUrl: U('1559620192-032c4bc4674e'),
    featured: true,
    available: true,
  },
  {
    name: 'Blush Peony Wedding Cake',
    description:
      'A romantic three-tier cake dressed in dusty rose buttercream with sculpted sugar peonies cascading down the side. Champagne sponge with raspberry conserve.',
    price: 620,
    category: 'Wedding',
    imageUrl: U('1622621746668-59fb299bc4d7'),
    featured: false,
    available: true,
  },
  {
    name: 'Golden Birthday Celebration',
    description:
      'A bold two-tier cake finished in a deep gold leaf texture with hand-painted florals. Rich chocolate sponge filled with salted caramel ganache.',
    price: 195,
    category: 'Birthday',
    imageUrl: U('1587314168485-3236d6710814'),
    featured: true,
    available: true,
  },
  {
    name: 'Whimsical Rainbow Smash',
    description:
      'A vibrant four-layer rainbow cake with clouds of vanilla Swiss meringue buttercream and rainbow sprinkle drip. Perfect for first birthdays and joyful celebrations.',
    price: 145,
    category: 'Birthday',
    imageUrl: U('1486427944299-d1955d23e34d'),
    featured: false,
    available: true,
  },
  {
    name: 'Autumn Spiced Harvest',
    description:
      'A seasonally inspired cake with layers of warming cinnamon, cardamom, and apple. Finished with a rustic cream cheese frost and dried orange slices.',
    price: 165,
    category: 'Seasonal',
    imageUrl: U('1612203985729-70726954388c'),
    featured: true,
    available: true,
  },
  {
    name: 'Strawberry Midsummer',
    description:
      'Light as air — a génoise sponge with layers of fresh Kentish strawberries and crème diplomate, topped with a crown of seasonal berries.',
    price: 155,
    category: 'Seasonal',
    imageUrl: U('1535141192574-5d4897c12636'),
    featured: false,
    available: true,
  },
  {
    name: 'Bespoke Portrait Cake',
    description:
      'A fully custom-designed cake built around your vision. We work with you on every detail — flavours, tiers, colour palette, and any sculptural elements.',
    price: 450,
    category: 'Custom',
    imageUrl: U('1571115177098-24ec42ed204d'),
    featured: false,
    available: true,
  },
  {
    name: 'Floral Cascade Custom',
    description:
      'A custom three-tier cake draped in hand-crafted sugar florals designed to match your event palette exactly. Flavours and colours chosen at consultation.',
    price: 520,
    category: 'Custom',
    imageUrl: U('1464349095431-e9a21285b5f3'),
    featured: false,
    available: true,
  },
  {
    name: 'Winter Spice Wedding',
    description:
      'A seasonal wedding cake with warming ginger and dark chocolate sponge, iced in a bone-white textured buttercream with sprigs of frosted rosemary and cranberry.',
    price: 710,
    category: 'Wedding',
    imageUrl: U('1578985545062-69928b1d9587'),
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
