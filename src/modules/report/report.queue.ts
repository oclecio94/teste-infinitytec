import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../../database/prisma.service';

@Processor('report')
export class ReportQueueProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('generate-report')
  async handleReportJob(job: Job) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const report = {
      totalTransactions: transactions.length,
      totalDeposits: transactions.filter((t) => t.type === 'DEPOSIT').length,
      totalWithdrawals: transactions.filter((t) => t.type === 'WITHDRAWAL')
        .length,
      totalTransfers: transactions.filter((t) => t.type === 'TRANSFER').length,
    };

    await this.prisma.dailyReport.create({
      data: {
        reportDate: new Date(),
        content: report,
      },
    });
  }
}
