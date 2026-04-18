import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@pizzahub.com' },
    update: {},
    create: {
      email: 'admin@pizzahub.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Hub',
      role: 'ADMIN',
    },
  });

  // Categories
  const catPizza = await prisma.category.upsert({
    where: { name: 'Pizzas' },
    update: {},
    create: { name: 'Pizzas' },
  });

  const catDrink = await prisma.category.upsert({
    where: { name: 'Boissons' },
    update: {},
    create: { name: 'Boissons' },
  });

  const catDessert = await prisma.category.upsert({
    where: { name: 'Desserts' },
    update: {},
    create: { name: 'Desserts' },
  });

  // Pizzas
  const pizzas = [
    {
      name: 'Margherita',
      description: 'Tomate, mozzarella, basilic frais',
      price: 10.0,
      categoryId: catPizza.id,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400',
    },
    {
      name: 'Reine',
      description: 'Tomate, mozzarella, jambon, champignons',
      price: 12.5,
      categoryId: catPizza.id,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
    },
    {
        name: '4 Fromages',
        description: 'Tomate, mozzarella, chèvre, gorgonzola, emmental',
        price: 14.0,
        categoryId: catPizza.id,
        imageUrl: 'https://images.unsplash.com/photo-1573452331575-236f0ec494a8?auto=format&fit=crop&q=80&w=400',
      },
  ];

  for (const p of pizzas) {
    await prisma.product.upsert({
      where: { id: p.name }, // This is just for seeding
      update: {},
      create: p,
    }).catch(async (e) => {
        // Fallback if upsert fails on where (Product doesn't have name as unique in schema)
        await prisma.product.create({ data: p });
    });
  }

  // Toppings
  const toppings = [
      { name: 'Extra Fromage', price: 1.5 },
      { name: 'Champignons', price: 1.0 },
      { name: 'Olives', price: 0.5 },
      { name: 'Piment', price: 0.2 },
  ];

  for (const t of toppings) {
      await prisma.topping.create({ data: t }).catch(() => {});
  }

  // Delivery Zones
  const zones = [
    { name: 'Paris Center', fee: 2.50, minOrder: 15.00, estimatedTime: 30 },
    { name: 'Paris North', fee: 3.50, minOrder: 20.00, estimatedTime: 45 },
  ];

  for (const z of zones) {
    await prisma.deliveryZone.upsert({
        where: { name: z.name },
        update: {},
        create: z,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
