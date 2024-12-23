import { ApiProperty } from '@nestjs/swagger';

export class transactionDTO {
  @ApiProperty({
    type: 'number',
    description: 'amount of the transaction',
    example: '1000(number) for R$10.00',
  })
  amount: number;
}
