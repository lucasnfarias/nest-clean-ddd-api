import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common'
import { ZodSchema } from 'zod'
import { fromZodError, ZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      throw new BadRequestException({
        message: 'Validation failed',
        error: fromZodError(error as ZodError),
        metadata,
        statusCode: 400,
      })
    }
  }
}
