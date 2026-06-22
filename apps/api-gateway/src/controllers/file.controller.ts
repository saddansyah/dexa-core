import {
  Controller,
  Post,
  Delete,
  Get,
  Inject,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  SERVICES,
  COMMANDS,
  UploadFileDto,
  DeleteFileDto,
  GetPresignedUrlDto,
} from '@app/common';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(
    @Inject(SERVICES.FILE) private readonly fileClient: ClientProxy,
  ) { }

  @Post('upload')
  @ApiOperation({ summary: 'Upload file to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Binary file to be uploaded',
        },
        key: {
          type: 'string',
          description: 'Optional file key (defaults to original filename if empty)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ) {
    return this.fileClient.send(
      { cmd: COMMANDS.FILE.UPLOAD },
      {
        key: body.key || file.originalname,
        file: {
          type: 'Buffer',
          data: Array.from(file.buffer as Buffer),
        },
        mimeType: file.mimetype,
      },
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Delete file from S3' })
  async deleteFile(@Query() query: DeleteFileDto) {
    return this.fileClient.send(
      { cmd: COMMANDS.FILE.DELETE },
      { key: query.key },
    );
  }

  @Get('presigned-url')
  @ApiOperation({ summary: 'Get presigned download URL for a file' })
  async getPresignedUrl(@Query() query: GetPresignedUrlDto) {
    return this.fileClient.send(
      { cmd: COMMANDS.FILE.GET_PRESIGNED_URL },
      {
        key: query.key,
        expiresInSeconds: query.expiresInSeconds,
      },
    );
  }
}
