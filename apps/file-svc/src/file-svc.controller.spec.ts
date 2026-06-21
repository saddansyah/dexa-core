import { Test, TestingModule } from '@nestjs/testing';
import { FileSvcController } from './file-svc.controller';
import { FileSvcService } from './file-svc.service';

describe('FileSvcController', () => {
  let fileSvcController: FileSvcController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileSvcController],
      providers: [FileSvcService],
    }).compile();

    fileSvcController = app.get<FileSvcController>(FileSvcController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fileSvcController.getHello()).toBe('Hello World!');
    });
  });
});
