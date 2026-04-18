import { PrismaClient } from '@pizza-platform/database';

const prisma = new PrismaClient();

async function monitorOrders() {
  console.log('--- 👷 Worker: Order Monitor Active ---');
  
  setInterval(async () => {
    try {
      const pendingOrders = await prisma.order.findMany({
        where: { status: 'PENDING' },
        include: { items: true }
      });

      if (pendingOrders.length > 0) {
        console.log(`[WORKER] 🚨 ${pendingOrders.length} New PENDING orders detected!`);
        pendingOrders.forEach((order: any) => {
            console.log(`  -> Order #${order.id.slice(0,8)} | Total: ${order.total}€`);
        });
      }
    } catch (e) {
      console.error('[WORKER] Error monitoring orders:', e);
    }
  }, 10000); // Check every 10s
}

monitorOrders();
