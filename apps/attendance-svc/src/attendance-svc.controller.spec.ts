import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceSvcController } from './attendance-svc.controller';
import { AttendanceSvcService } from './attendance-svc.service';

describe('AttendanceSvcController', () => {
  let attendanceSvcController: AttendanceSvcController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceSvcController],
      providers: [AttendanceSvcService],
    }).compile();

    attendanceSvcController = app.get<AttendanceSvcController>(AttendanceSvcController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(attendanceSvcController.getHello()).toBe('Hello World!');
    });
  });
});
