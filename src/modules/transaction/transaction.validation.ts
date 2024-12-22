import { z } from 'zod';

export const TransactionSchema = z.object({
  amount: z.number().min(1, { message: 'Amount must be at least 1' }),
});
