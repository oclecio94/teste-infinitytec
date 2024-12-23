import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReportService {
  constructor(@InjectQueue('report') private readonly reportQueue: Queue) {}

  //@Cron('59 23 * * *') // Executa às 23:59 todos os dias
  //@Cron('*/30 * * * * *') // Executa a cada 30 segundos
  @Cron('0 */3 * * *') // Executa a cada 3 horas
  async scheduleDailyReport() {
    await this.reportQueue.add('generate-report', {}, { delay: 0 });
  }
}
