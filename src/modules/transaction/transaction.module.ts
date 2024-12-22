import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [
    BullModule.registerQueue({
      name: 'transactions',
    }),
  ],
})
export class TransactionModule {}
