import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { BullModule } from '@nestjs/bull';
import { TransactionQueueProcessor } from './modules/transaction/transaction.queue';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'transaction',
    }),
    PrismaModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, TransactionQueueProcessor],
})
export class AppModule {}
