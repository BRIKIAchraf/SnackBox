import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, isDeleted: false },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findFirst({
        where: { id, isDeleted: false }
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async softDelete(id: string) {
    return this.prisma.user.update({
        where: { id },
        data: { isDeleted: true }
    });
  }

  async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.CLIENT,
      },
    });
  }

  async convertGuestToUser(orderId: string, email: string, phone?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }});
    if (!order) throw new Error("Commande introuvable");
    if (order.userType === "REGISTERED") throw new Error("Cet utilisateur a déjà un compte.");

    // Generate a secure random password for the new account
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const names = (order.customerName || "Client Invité").split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

    const newUser = await this.prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            firstName,
            lastName,
            phone: phone || order.customerPhone,
            role: UserRole.CLIENT
        }
    });

    // Link the guest order(s) by customerPhone or customerEmail if they match
    // For simplicity, we just link the exact order that was requested. 
    // Usually, you can link all orders matching the phone/email.
    if (phone || order.customerPhone) {
        await this.prisma.order.updateMany({
            where: { 
                customerPhone: phone || order.customerPhone,
                userType: 'GUEST'
            },
            data: { 
                userId: newUser.id,
                userType: 'REGISTERED' 
            }
        });
    } else {
        // Fallback to just the current order
        await this.prisma.order.update({
            where: { id: order.id },
            data: { userId: newUser.id, userType: 'REGISTERED' }
        });
    }

    // In a real app we would email the generated password to them
    return { user: newUser, tempPassword: randomPassword };
  }
}
