import { Injectable } from '@nestjs/common';

@Injectable()
export class FileSvcService {
  getHello(): string {
    return 'Hello World!';
  }
}
