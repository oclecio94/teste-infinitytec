import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from 'src/database/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';

@Processor('transactions')
@Injectable()
export class TransactionQueueProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('processTransaction')
  async handleTransaction(job: Job) {
    const { type, userId, targetUserId, amount } = job.data;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException({
        success: false,
        message: 'user not found',
      });
    }

    switch (type) {
      case 'DEPOSIT':
        if (amount <= 0)
          throw new BadRequestException({
            success: false,
            message: 'Invalid deposit amount',
          });

        await this.prisma.transaction.create({
          data: { type, amount, userId },
        });

        await this.prisma.user.update({
          where: { id: userId },
          data: { balance: { increment: amount } },
        });
        break;

      case 'WITHDRAWAL':
        if (user.balance < amount)
          throw new BadRequestException({
            success: false,
            message: 'Insufficient balance',
          });

        await this.prisma.transaction.create({
          data: { type, amount, userId },
        });

        await this.prisma.user.update({
          where: { id: userId },
          data: { balance: { decrement: amount } },
        });
        break;

      case 'TRANSFER':
        const targetUser = await this.prisma.user.findUnique({
          where: { id: targetUserId },
        });
        if (!targetUser)
          throw new BadRequestException({
            success: false,
            message: 'Target user not found',
          });

        if (user.balance < amount)
          throw new BadRequestException({
            success: false,
            message: 'Insufficient balance',
          });

        await this.prisma.transaction.create({
          data: { type, amount, userId, targetUserId },
        });

        await this.prisma.user.update({
          where: { id: userId },
          data: { balance: { decrement: amount } },
        });

        await this.prisma.user.update({
          where: { id: targetUserId },
          data: { balance: { increment: amount } },
        });
        break;

      default:
        throw new BadRequestException({
          success: false,
          message: 'Invalid transaction type',
        });
    }
  }
}
