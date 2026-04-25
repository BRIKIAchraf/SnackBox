import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean up existing data to prevent duplicates (Optional, but good for fresh seeds)
  // Delete in reverse order of relationships
  await prisma.orderItemTopping.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.topping.deleteMany({});
  await prisma.deliveryZone.deleteMany({});
  await prisma.preferences.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.settings.deleteMany({});

  console.log('🧹 Cleaned existing database records.');

  // 2. Create Global Settings
  await prisma.settings.create({
    data: {
      id: 'global',
      restaurantName: 'SNACK BOX PREMIUM',
      contactEmail: 'contact@snackbox.com',
      minOrderValue: 15.0,
      deliveryFee: 2.5,
      preparationTime: 20,
      deliveryTime: 30,
      isOpen: true,
    }
  });

  // 3. Create Admin & Client Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientPassword = await bcrypt.hash('client123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@snackbox.com',
      password: adminPassword,
      firstName: 'Chef',
      lastName: 'Admin',
      phone: '0600000000',
      role: 'ADMIN',
    }
  });

  const client1 = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: clientPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0611223344',
      role: 'CLIENT',
      preferences: {
        create: {
          smsNotifs: true,
          emailNotifs: true
        }
      },
      addresses: {
        create: {
          street: '15 Rue de Paris',
          city: 'Lyon',
          zipCode: '69001',
          instructions: 'Code interphone 1234'
        }
      }
    }
  });

  // 4. Create Delivery Zones
  const zoneA = await prisma.deliveryZone.create({
    data: { name: 'Zone Centre-Ville', fee: 0, minOrder: 15, estimatedTime: 20, isActive: true }
  });
  const zoneB = await prisma.deliveryZone.create({
    data: { name: 'Zone Périphérie', fee: 3.5, minOrder: 25, estimatedTime: 40, isActive: true }
  });

  // 5. Create Categories
  const catPizzas = await prisma.category.create({ data: { name: 'Pizzas' } });
  const catTacos = await prisma.category.create({ data: { name: 'Tacos' } });
  const catBurgers = await prisma.category.create({ data: { name: 'Burgers' } });
  const catDrinks = await prisma.category.create({ data: { name: 'Boissons' } });
  const catDesserts = await prisma.category.create({ data: { name: 'Desserts' } });

  // 6. Create Products
  console.log('🍕 Seeding products...');
  
  await prisma.product.createMany({
    data: [
      {
        name: 'Pizza Margherita',
        description: 'Sauce tomate, mozzarella fior di latte, basilic frais, huile d\'olive.',
        price: 11.0,
        categoryId: catPizzas.id,
        images: ['https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop'],
        available: true,
      },
      {
        name: 'Pizza Regina',
        description: 'Sauce tomate, mozzarella, jambon, champignons frais.',
        price: 13.5,
        categoryId: catPizzas.id,
        images: ['https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1935&auto=format&fit=crop'],
        available: true,
      },
      {
        name: 'Tacos Simple (1 Viande)',
        description: 'Galette XL, frites, sauce fromagère maison, 1 viande au choix.',
        price: 8.5,
        categoryId: catTacos.id,
        images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop'],
        available: true,
      },
      {
        name: 'Tacos Double (2 Viandes)',
        description: 'Galette XXL, frites, sauce fromagère maison, 2 viandes.',
        price: 11.5,
        categoryId: catTacos.id,
        images: ['https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=2071&auto=format&fit=crop'],
        available: true,
      },
      {
        name: 'Classic Cheeseburger',
        description: 'Pain brioché, steak haché 150g, cheddar affiné, salade, tomate, sauce secrète.',
        price: 9.5,
        categoryId: catBurgers.id,
        images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop'],
        available: true,
      },
      {
        name: 'Coca-Cola 33cl',
        description: 'Canette bien fraîche.',
        price: 2.5,
        categoryId: catDrinks.id,
        images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1954&auto=format&fit=crop'],
        available: true,
      },
      {
        name: 'Tiramisu Maison',
        description: 'Véritable tiramisu italien au café et mascarpone.',
        price: 4.5,
        categoryId: catDesserts.id,
        images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1936&auto=format&fit=crop'],
        available: true,
      }
    ]
  });

  // 7. Create Toppings (Extra ingredients)
  console.log('🧀 Seeding toppings...');
  await prisma.topping.createMany({
    data: [
      { name: 'Supplément Fromage', price: 1.5, available: true },
      { name: 'Supplément Viande', price: 2.0, available: true },
      { name: 'Sauce Algérienne', price: 0.5, available: true },
      { name: 'Champignons', price: 1.0, available: true },
      { name: 'Bacon', price: 1.5, available: true },
    ]
  });

  console.log('✅ Seeding completed successfully!');
  console.log('====================================');
  console.log('Credentials to test the App:');
  console.log('Admin : admin@snackbox.com / admin123');
  console.log('Client: client@example.com / client123');
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
