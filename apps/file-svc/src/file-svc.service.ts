import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileSvcService implements OnModuleInit {
  private readonly logger = new Logger(FileSvcService.name);
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl?: string;
  private endpoint: string;

  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    this.endpoint = this.configService.getOrThrow<string>('S3_STORAGE_ENDPOINT');
    const region = this.configService.getOrThrow<string>('S3_STORAGE_REGION');
    const accessKeyId = this.configService.getOrThrow<string>('S3_STORAGE_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>('S3_STORAGE_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.getOrThrow<string>('S3_STORAGE_BUCKET_NAME');
    const forcePathStyle = this.configService.getOrThrow<string>('S3_STORAGE_FORCE_PATH_STYLE') === 'true';
    this.publicUrl = this.configService.get<string>('S3_STORAGE_PUBLIC_URL');

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: forcePathStyle,
    });

    this.logger.log(`Verifying connection to storage endpoint: ${this.endpoint} (bucket: ${this.bucketName})...`);
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`Successfully connected to storage bucket: ${this.bucketName}`);
    } catch (error) {
      this.logger.error(
        `Failed to connect to storage bucket: ${this.bucketName}. Error: ${error instanceof Error ? error.message : String(error)}`
      );
      process.exit(1);
    }
  }

  async uploadFile(key: string, file: Buffer, mimeType?: string): Promise<{ key: string; url: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);

    const url = this.publicUrl
      ? `${this.publicUrl.replace(/\/$/, '')}/${key}`
      : `${this.endpoint.replace(/\/$/, '')}/${this.bucketName}/${key}`;

    return { key, url };
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async getPresignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
  }
}
