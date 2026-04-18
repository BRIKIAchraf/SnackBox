const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.count();
  const categories = await prisma.category.count();
  const settings = await prisma.settings.count();
  const users = await prisma.user.count();

  console.log('--- DATABASE DIAGNOSTICS ---');
  console.log('Products:', products);
  console.log('Categories:', categories);
  console.log('Settings:', settings);
  console.log('Users:', users);
  console.log('----------------------------');
}

main().finally(() => prisma.$disconnect());
