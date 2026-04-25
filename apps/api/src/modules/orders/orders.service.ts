import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { DeliveryZonesService } from '../delivery-zones/delivery-zones.service';
import { SchedulingService } from '../scheduling/scheduling.service';
import { PaymentsService } from '../payments/payments.service';
import { OrderStatus, PaymentStatus, UserRole } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly deliveryZonesService: DeliveryZonesService,
    private readonly schedulingService: SchedulingService,
    private readonly paymentsService: PaymentsService
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

  async validateCart(items: any[] = [], offers: any[] = [], deliveryZoneId?: string, lat?: number, lng?: number, zipCode?: string) {
    const corrections = [];
    let updatedTotal = 0;
    const validatedItems = [];
    const validatedOffers = [];

    const isOpen = await this.validateTime();
    if (!isOpen) {
        corrections.push("Le restaurant est actuellement fermé.");
    }

    // Validation des produits standards
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

      if (product.price !== item.basePrice && product.price !== item.price) {
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
        actualToppings: validatedToppings
      });
    }

    // Validation des offres
    for (const offer of offers) {
      const dbOffer = await this.prisma.offer.findUnique({
         where: { id: offer.offerId }
      });

      if (!dbOffer || dbOffer.isDeleted) {
         corrections.push(`${offer.name} n'existe plus.`);
         continue;
      }
      if (!dbOffer.available) {
         corrections.push(`L'offre ${dbOffer.name} est actuellement indisponible.`);
      }
      
      // Since an offer can have custom textual options (ex: drinks added) that change the price on the client side,
      // For now we accept the price sent by the client for the customized offer package, but we enforce a minimum base price.
      if (offer.price < dbOffer.price) {
         corrections.push(`Le prix de l'offre ${dbOffer.name} est incohérent.`);
      }

      updatedTotal += offer.price * offer.quantity;
      validatedOffers.push({
         ...offer,
         name: dbOffer.name,
         options: JSON.stringify(offer.customOptions || []) // We store custom selections here
      });
    }

    let deliveryFee = 0;
    
    // Geographical Validation
    if (lat && lng) {
        const validatedZone = await this.deliveryZonesService.validateLocation(lat, lng, zipCode);
        if (!validatedZone) {
            corrections.push("Désolé, cette adresse n'est pas dans notre zone de livraison.");
        } else {
            deliveryFee = validatedZone.fee;
        }
    } else if (deliveryZoneId) {
        const zone = await this.prisma.deliveryZone.findUnique({ where: { id: deliveryZoneId } });
        if (zone && zone.isActive) {
            deliveryFee = zone.fee;
        } else {
            corrections.push("Zone de livraison inactive.");
        }
    }
    
    updatedTotal += deliveryFee;

    return {
      valid: corrections.length === 0,
      corrections,
      updatedTotal,
      validatedItems,
      validatedOffers,
      deliveryFee
    };
  }

  async create(data: any) {
    const validation = await this.validateCart(
        data.items || [], 
        data.offers || [], 
        data.deliveryZoneId,
        data.lat,
        data.lng,
        data.zipCode
    );
    
    if (!validation.valid) {
      throw new BadRequestException({ message: "Cart error", corrections: validation.corrections });
    }

    // Scheduling Validation
    if (!data.isASAP && data.scheduledSlot) {
        const availableSlots = await this.schedulingService.getAvailableSlots();
        if (!availableSlots.includes(data.scheduledSlot)) {
            throw new BadRequestException({ message: "Ce créneau n'est plus disponible." });
        }
    }

    const order = await this.prisma.order.create({
      data: {
        total: validation.updatedTotal,
        deliveryFee: validation.deliveryFee,
        status: OrderStatus.PENDING_PAYMENT,
        paymentStatus: (data.paymentStatus as PaymentStatus) || PaymentStatus.PENDING,
        paymentMethod: data.paymentMethod || 'CASH',
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        isASAP: data.isASAP ?? true,
        scheduledSlot: data.scheduledSlot,
        scheduledDate: data.scheduledSlot ? new Date() : null, // Assuming current date for now
        address: data.addressId ? { connect: { id: data.addressId } } : undefined,
        user: data.userId ? { connect: { id: data.userId } } : undefined,
        userType: data.userId ? 'REGISTERED' : 'GUEST',
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
        },
        offers: {
            create: validation.validatedOffers.map((offer: any) => ({
                offerId: offer.offerId,
                quantity: offer.quantity,
                price: offer.price,
                name: offer.name,
                options: offer.options
            }))
        }
      } as any,
      include: { items: { include: { toppings: true } }, offers: true }
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

  async updateStatus(id: string, status: OrderStatus, adminUserId?: string) {
    const currentOrder = await this.prisma.order.findUnique({ where: { id } });
    if (!currentOrder) throw new BadRequestException("Commande introuvable.");

    // Handle Payment Capture/Canceled if it was authorized
    if (currentOrder.paymentIntentId) {
        if (status === OrderStatus.CONFIRMED && currentOrder.status === OrderStatus.PENDING_ADMIN_VALIDATION) {
            await this.paymentsService.capturePayment(currentOrder.paymentIntentId);
        } else if (status === OrderStatus.CANCELLED) {
            await this.paymentsService.cancelPayment(currentOrder.paymentIntentId);
        }
    }

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
        where: { status: { not: OrderStatus.CANCELLED } },
        include: { items: true }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    
    const uniqueCustomers = await this.prisma.user.count({ where: { role: UserRole.CLIENT } });
    
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
        activeOrders: orders.filter(o => (([OrderStatus.PENDING_PAYMENT, OrderStatus.PAID, OrderStatus.CONFIRMED, OrderStatus.IN_PREPARATION, OrderStatus.READY, OrderStatus.DELIVERING] as OrderStatus[]).includes(o.status))).length
    };
  }
}
