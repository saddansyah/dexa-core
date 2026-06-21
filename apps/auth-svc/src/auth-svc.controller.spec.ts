import { Test, TestingModule } from '@nestjs/testing';
import { AuthSvcController } from './auth-svc.controller';
import { AuthSvcService } from './auth-svc.service';

describe('AuthSvcController', () => {
  let authSvcController: AuthSvcController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthSvcController],
      providers: [AuthSvcService],
    }).compile();

    authSvcController = app.get<AuthSvcController>(AuthSvcController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authSvcController.getHello()).toBe('Hello World!');
    });
  });
});
