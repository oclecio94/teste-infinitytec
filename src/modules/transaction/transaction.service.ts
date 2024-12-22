import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async deposit(userId: string, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException({
        success: false,
        message: 'user not found',
      });
    }
    if (amount <= 0) {
      throw new BadRequestException('the deposit amount must be positive');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        type: TransactionType.DEPOSIT,
        amount,
        userId,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    });

    return transaction;
  }

  async withdraw(userId: string, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException({
        success: false,
        message: 'user not found',
      });
    }

    if (user.balance < amount) {
      throw new BadRequestException('insufficient balance');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        type: TransactionType.WITHDRAWAL,
        amount,
        userId,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    });

    return transaction;
  }

  async transfer(userId: string, targetUserId: string, amount: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user || !targetUser) {
      throw new BadRequestException({
        success: false,
        message: 'user not found',
      });
    }

    if (user.balance < amount) {
      throw new BadRequestException('insufficient balance');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        type: TransactionType.TRANSFER,
        amount,
        userId,
        targetUserId,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    });

    await this.prisma.user.update({
      where: { id: targetUserId },
      data: { balance: { increment: amount } },
    });

    return transaction;
  }
}
