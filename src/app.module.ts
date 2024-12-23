import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from './modules/bull-board/bull-board.module';
import { ReportModule } from './modules/report/report.module';
import { TransactionQueueProcessor } from './modules/transaction/transaction.queue';
import { ReportQueueProcessor } from './modules/report/report.queue';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    BullModule.registerQueue({ name: 'transaction' }, { name: 'report' }),
    PrismaModule,
    AuthModule,
    TransactionModule,
    BullBoardModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService, TransactionQueueProcessor, ReportQueueProcessor],
})
export class AppModule {}
