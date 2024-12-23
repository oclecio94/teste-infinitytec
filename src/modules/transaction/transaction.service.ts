import { Injectable, BadRequestException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TransactionService {
  constructor(
    @InjectQueue('transactions') private readonly transactionQueue: Queue,
  ) {}

  async deposit(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException({
        success: false,
        message: 'the deposit amount must be positive',
      });
    }

    await this.transactionQueue.add('processTransaction', {
      type: TransactionType.DEPOSIT,
      userId,
      amount,
    });

    return { success: true, message: 'operation requested successfully' };
  }

  async withdraw(userId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException({
        success: false,
        message: 'the withdrawal amount must be positive',
      });
    }

    await this.transactionQueue.add('processTransaction', {
      type: TransactionType.WITHDRAWAL,
      userId,
      amount,
    });

    return { success: true, message: 'operation requested successfully' };
  }

  async transfer(userId: string, targetUserId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException({
        success: false,
        message: 'the transfer amount must be positive',
      });
    }

    await this.transactionQueue.add('processTransaction', {
      type: TransactionType.TRANSFER,
      userId,
      targetUserId,
      amount,
    });

    return { success: true, message: 'operation requested successfully' };
  }
}
