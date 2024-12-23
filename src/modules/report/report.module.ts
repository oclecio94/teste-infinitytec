import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ReportService } from './report.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'report',
    }),
  ],
  providers: [ReportService],
})
export class ReportModule {}
