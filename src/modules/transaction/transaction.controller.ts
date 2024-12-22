import { Controller, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionSchema } from './transaction.validation';
import { ZodValidation } from 'src/validation/zod.validation';
import { transactionDTO } from './transaction.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit/:userId')
  @ApiResponse({ status: 201, description: 'operation successful' })
  deposit(
    @Param('userId') userId: string,
    @Body(new ZodValidation(TransactionSchema)) data: transactionDTO,
  ) {
    return this.transactionService.deposit(userId, data.amount);
  }

  @Post('withdraw/:userId')
  @ApiResponse({ status: 201, description: 'operation successful' })
  withdraw(
    @Param('userId') userId: string,
    @Body(new ZodValidation(TransactionSchema)) data: transactionDTO,
  ) {
    return this.transactionService.withdraw(userId, data.amount);
  }

  @Post('transfer/:userId/:targetUserId')
  @ApiResponse({ status: 201, description: 'operation successful' })
  transfer(
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
    @Body(new ZodValidation(TransactionSchema)) data: transactionDTO,
  ) {
    return this.transactionService.transfer(userId, targetUserId, data.amount);
  }
}
