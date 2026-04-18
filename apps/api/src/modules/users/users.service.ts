import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
        role: data.role || 'CLIENT',
      },
    });
  }
}
