import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendanceSvcService {
  getHello(): string {
    return 'Hello World!';
  }
}
