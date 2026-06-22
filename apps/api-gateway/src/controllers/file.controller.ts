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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
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
import { v7 as uuidv7 } from 'uuid';
import * as path from 'path';

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
        folder: {
          type: 'string',
          description: 'Optional subfolder in S3 (e.g., "attendance", "avatar")',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({ fileType: /(image\/jpeg|image\/png|image\/webp|image\/gif|application\/pdf)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ) {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.-]/g, '_');

    let fileKey = body.key;
    if (!fileKey) {
      const folderPrefix = body.folder ? `${body.folder.replace(/\/$/, '')}/` : '';
      fileKey = `${folderPrefix}${uuidv7()}-${cleanName}${ext}`;
    }

    return this.fileClient.send(
      { cmd: COMMANDS.FILE.UPLOAD },
      {
        key: fileKey,
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
