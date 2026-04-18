import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async create(data: { action: string; entity: string; entityId?: string; userId?: string; details?: string }) {
    return this.prisma.auditLog.create({
      data: {
        ...data,
      },
    });
  }
}
