import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeSvcService {
  getHello(): string {
    return 'Hello World!';
  }
}
