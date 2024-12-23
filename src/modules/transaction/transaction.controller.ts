import { Controller, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionSchema } from './transaction.validation';
import { ZodValidation } from 'src/validation/zod.validation';
import { transactionDTO } from './transaction.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, Roles } from '../auth/auth.decorator';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit/:userId')
  @ApiBearerAuth()
  @Auth(Roles.ADMIN, Roles.USER)
  @ApiResponse({ status: 201, description: 'operation successful' })
  deposit(
    @Param('userId') userId: string,
    @Body(new ZodValidation(TransactionSchema)) data: transactionDTO,
  ) {
    return this.transactionService.deposit(userId, data.amount);
  }

  @Post('withdraw/:userId')
  @ApiBearerAuth()
  @Auth(Roles.ADMIN, Roles.USER)
  @ApiResponse({ status: 201, description: 'operation successful' })
  withdraw(
    @Param('userId') userId: string,
    @Body(new ZodValidation(TransactionSchema)) data: transactionDTO,
  ) {
    return this.transactionService.withdraw(userId, data.amount);
  }

  @Post('transfer/:userId/:targetUserId')
  @ApiBearerAuth()
  @Auth(Roles.ADMIN, Roles.USER)
  @ApiResponse({ status: 201, description: 'operation successful' })
  transfer(
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
    @Body(new ZodValidation(TransactionSchema)) data: transactionDTO,
  ) {
    return this.transactionService.transfer(userId, targetUserId, data.amount);
  }
}
