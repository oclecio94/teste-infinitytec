import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'transactions' }, { name: 'report' }),
  ],
})
export class BullBoardModule implements NestModule {
  constructor(
    @InjectQueue('transactions') private readonly transactionQueue: Queue,
    @InjectQueue('report') private readonly reportQueue: Queue,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [
        new BullAdapter(this.transactionQueue),
        new BullAdapter(this.reportQueue),
      ],
      serverAdapter,
    });

    consumer.apply(serverAdapter.getRouter()).forRoutes('/admin/queues');
  }
}
