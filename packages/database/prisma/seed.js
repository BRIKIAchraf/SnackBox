const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('--- 🍕 Seeding Initial Data ---');

  // 1. Create Categories
  const catPizza = await prisma.category.upsert({
    where: { name: 'Pizzas' },
    update: {},
    create: { name: 'Pizzas' },
  });

  const catDrink = await prisma.category.upsert({
    where: { name: 'Drinks' },
    update: {},
    create: { name: 'Drinks' },
  });

  const catDessert = await prisma.category.upsert({
    where: { name: 'Desserts' },
    update: {},
    create: { name: 'Desserts' },
  });

  // 2. Create Products
  const products = [
    { name: 'Margherita Royale', description: 'Fresh tomato sauce, melted mozzarella, and organic basil.', price: 12.5, categoryId: catPizza.id, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&w=800' },
    { name: 'Truffe & Burrata', description: 'Truffle cream, fresh burrata, and arugula.', price: 18.0, categoryId: catPizza.id, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800' },
    { name: 'Pepperoni Inferno', description: 'Spicy pepperoni, chili flakes, and hot honey.', price: 15.5, categoryId: catPizza.id, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800' },
    { name: 'Coca Cola Zero', description: '33cl cold can.', price: 2.5, categoryId: catDrink.id, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800' },
    { name: 'Tiramisu Maison', description: 'Classic Italian tiramisu with fresh espresso.', price: 6.5, categoryId: catDessert.id, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800' },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  // 3. Create Toppings
  const toppings = [
    { name: 'Extra Mozzarella', price: 1.5 },
    { name: 'Fresh Truffle', price: 5.0 },
    { name: 'Spicy Honey', price: 1.0 },
    { name: 'Black Olives', price: 0.8 },
  ];

  for (const t of toppings) {
    await prisma.topping.create({ data: t });
  }

  // 4. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@pizzahub.com' },
    update: {},
    create: {
      email: 'admin@pizzahub.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'ADMIN'
    }
  });

  // 5. Initial Settings
  await prisma.settings.upsert({
      where: { id: 'global' },
      update: {},
      create: {
          restaurantName: 'PIZZA HUB PREMIUM',
          contactEmail: 'manager@pizzahub.com',
          minOrderValue: 12.0
      }
  });

  console.log('--- ✅ Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
