import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeSvcController } from './employee-svc.controller';
import { EmployeeSvcService } from './employee-svc.service';

describe('EmployeeSvcController', () => {
  let employeeSvcController: EmployeeSvcController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeSvcController],
      providers: [EmployeeSvcService],
    }).compile();

    employeeSvcController = app.get<EmployeeSvcController>(EmployeeSvcController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(employeeSvcController.getHello()).toBe('Hello World!');
    });
  });
});
