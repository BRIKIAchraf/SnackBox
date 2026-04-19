import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SchedulingService {
  constructor(private readonly prisma: PrismaService) {}

  async getAvailableSlots(date: string = new Date().toISOString().split('T')[0]) {
    const settings = await this.prisma.settings.findUnique({ where: { id: 'global' } });
    if (!settings) return [];

    const openingHours = JSON.parse((settings as any).openingHours);
    const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
    const hours = openingHours[dayOfWeek];

    if (!hours || hours === 'closed') return [];

    const [openStr, closeStr] = hours.split('-');
    const [openH, openM] = openStr.split(':').map(Number);
    let [closeH, closeM] = closeStr.split(':').map(Number);

    // Handle closing after midnight (e.g. 00:00)
    if (closeH === 0) closeH = 24;

    const slots = [];
    const now = new Date();
    const isToday = date === now.toISOString().split('T')[0];
    
    // First possible time = Now + Prep + Delivery (safety buffer)
    let startTime = new Date(date);
    startTime.setHours(openH, openM, 0, 0);

    if (isToday) {
        const earliest = new Date();
        earliest.setMinutes(earliest.getMinutes() + settings.preparationTime + settings.deliveryTime);
        if (earliest > startTime) {
            startTime = earliest;
            // Round to next 30 min
            const minutes = startTime.getMinutes();
            if (minutes > 30) {
                startTime.setHours(startTime.getHours() + 1, 0, 0, 0);
            } else if (minutes > 0) {
                startTime.setMinutes(30, 0, 0);
            }
        }
    }

    const endTime = new Date(date);
    endTime.setHours(closeH, closeM, 0, 0);

    let current = new Date(startTime);
    while (current < endTime) {
        const slotTime = current.toTimeString().substring(0, 5);
        
        // Check capacity
        const count = await this.prisma.order.count({
            where: {
                scheduledSlot: slotTime,
                scheduledDate: {
                    gte: new Date(date + "T00:00:00Z"),
                    lte: new Date(date + "T23:59:59Z")
                },
                status: { notIn: ['CANCELLED'] }
            } as any
        });

        if (count < (settings as any).maxOrdersPerSlot) {
            slots.push(slotTime);
        }

        current.setMinutes(current.getMinutes() + 30);
    }

    return slots;
  }
}
