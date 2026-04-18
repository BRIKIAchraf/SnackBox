import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  async findAll(userId?: string) {
    return this.prisma.order.findMany({
      where: {
        ...(userId && { userId }),
      },
      include: { 
        items: { 
          include: { 
            product: true,
            toppings: true
          } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { 
        items: { 
          include: { 
            product: true,
            toppings: true
          } 
        } 
      }
    });
  }

  async validateTime() {
    const settings = await this.prisma.settings.findUnique({ where: { id: 'global' } });
    if (settings && !settings.isOpen) {
        return false;
    }
    return true;
  }

  async validateCart(items: any[], deliveryZoneId?: string) {
    const corrections = [];
    let updatedTotal = 0;
    const validatedItems = [];

    const isOpen = await this.validateTime();
    if (!isOpen) {
        corrections.push("Le restaurant est actuellement fermé.");
    }

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || product.isDeleted) {
        corrections.push(`${item.name} n'est plus disponible.`);
        continue;
      }

      if (!product.available) {
        corrections.push(`${product.name} est actuellement indisponible.`);
      }

      if (product.price !== item.price) {
        corrections.push(`Le prix de ${product.name} a changé.`);
      }

      let itemTotal = product.price;

      const validatedToppings = [];
      if (item.toppings && item.toppings.length > 0) {
        for (const toppingId of item.toppings) {
          const topping = await this.prisma.topping.findUnique({
            where: { id: toppingId }
          });
          if (!topping || !topping.available) {
            corrections.push(`L'ingrédient ${topping?.name || 'inconnu'} n'est plus disponible.`);
          } else {
            itemTotal += topping.price;
            validatedToppings.push(topping);
          }
        }
      }

      updatedTotal += itemTotal * item.quantity;
      validatedItems.push({
        ...item,
        price: product.price,
        name: product.name,
        available: product.available,
        actualToppings: validatedToppings
      });
    }

    let deliveryFee = 0;
    if (deliveryZoneId) {
        const zone = await this.prisma.deliveryZone.findUnique({ where: { id: deliveryZoneId } });
        if (zone && zone.isActive) {
            deliveryFee = zone.fee;
            updatedTotal += deliveryFee;
        } else {
            corrections.push("Zone de livraison inactive.");
        }
    }

    return {
      valid: corrections.length === 0,
      corrections,
      updatedTotal,
      validatedItems,
      deliveryFee
    };
  }

  async create(data: any) {
    const validation = await this.validateCart(data.items, data.deliveryZoneId);
    
    const order = await this.prisma.order.create({
      data: {
        total: validation.updatedTotal,
        deliveryFee: validation.deliveryFee,
        status: 'PENDING_PAYMENT',
        paymentStatus: data.paymentStatus || 'PENDING',
        paymentMethod: data.paymentMethod || 'CASH',
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        // Since schema uses a relation to Address model, we use addressId or connect
        address: data.addressId ? { connect: { id: data.addressId } } : undefined,
        user: data.userId ? { connect: { id: data.userId } } : undefined,
        deliveryZone: data.deliveryZoneId ? { connect: { id: data.deliveryZoneId } } : undefined,
        items: {
          create: validation.validatedItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            toppings: {
              create: item.actualToppings.map((t: any) => ({
                toppingId: t.id,
                name: t.name,
                price: t.price
              }))
            }
          }))
        }
      },
      include: { items: { include: { toppings: true } } }
    });

    await this.prisma.auditLog.create({
        data: {
            action: 'CREATE_ORDER',
            entity: 'ORDER',
            entityId: order.id,
            userId: data.userId,
            details: JSON.stringify({ total: order.total })
        }
    });

    this.notificationsGateway.notifyNewOrder(order);
    return order;
  }

  async updateStatus(id: string, status: string, adminUserId?: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status }
    });

    await this.prisma.auditLog.create({
        data: {
            action: 'UPDATE_STATUS',
            entity: 'ORDER',
            entityId: id,
            userId: adminUserId,
            details: JSON.stringify({ status })
        }
    });

    this.notificationsGateway.notifyStatusUpdate(id, status);
    return order;
  }

  async getDashboardStats() {
    const orders = await this.prisma.order.findMany({
        where: { status: { not: 'CANCELLED' } },
        include: { items: true }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    
    const uniqueCustomers = await this.prisma.user.count({ where: { role: 'CLIENT' } });
    
    const productSales: Record<string, { id: string, name: string, count: number }> = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.productId]) {
                productSales[item.productId] = { id: item.productId, name: item.name, count: 0 };
            }
            productSales[item.productId].count += item.quantity;
        });
    });

    const sortedProducts = Object.values(productSales).sort((a, b) => b.count - a.count);
    const topProduct = sortedProducts[0] || { name: 'N/A', count: 0 };

    return {
        totalRevenue,
        orderCount,
        customerCount: uniqueCustomers,
        bestSeller: topProduct.name,
        activeOrders: orders.filter(o => ['PENDING', 'PREPARING'].includes(o.status)).length
    };
  }
}
