import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileSvcController } from './file-svc.controller';
import { FileSvcService } from './file-svc.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [FileSvcController],
  providers: [FileSvcService],
})
export class FileSvcModule {}

