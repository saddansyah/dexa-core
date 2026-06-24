import {
  Controller,
  Post,
  Inject,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  SERVICES,
  COMMANDS,
  AuthGuard,
  CurrentUser,
  JwtPayloadDto,
  STORAGE_FOLDERS,
  ApiCreatedResponseStandard,
  FileUploadResponseDto,
} from '@app/common';
import * as path from 'path';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(
    @Inject(SERVICES.FILE) private readonly fileClient: ClientProxy,
  ) { }

  @Post('upload-attendance')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload attendance photo to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Binary file to be uploaded (attendance photo)',
        },
      },
    },
  })
  @ApiCreatedResponseStandard(FileUploadResponseDto)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
          new FileTypeValidator({ fileType: /(image\/jpeg|image\/png|image\/webp|image\/gif)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: JwtPayloadDto,
  ) {
    const employeeId = user.employeeId || user.sub || 'unknown';
    const employeeName = user.name
      ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
      : user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    
    // Format: [folder]/employeeId-name-timestamp.ext
    const fileKey = `${STORAGE_FOLDERS.ATTENDANCE}/${employeeId}-${employeeName}-${timestamp}${ext}`;

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
}

