import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidation implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: any) {
    try {
      this.schema.parse(value);
      return value;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorMessages = e.errors.map((err) => err.message).join(', ');
        throw new BadRequestException({
          success: false,
          message: errorMessages,
        });
      }

      throw new BadRequestException({
        success: false,
        message: 'Validation failed',
      });
    }
  }
}
