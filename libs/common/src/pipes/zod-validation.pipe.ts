import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as zod from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: zod.ZodSchema) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: unknown, metadata: ArgumentMetadata) {
    return await this.schema.parseAsync(value);
  }
}


