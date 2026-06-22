import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileSvcService implements OnModuleInit {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl?: string;
  private endpoint: string;

  constructor(private readonly configService: ConfigService) { }

  onModuleInit() {
    this.endpoint = this.configService.get<string>('STORAGE_ENDPOINT') || 'http://127.0.0.1:9000';
    const region = this.configService.get<string>('STORAGE_REGION') || 'us-east-1';
    const accessKeyId = this.configService.get<string>('STORAGE_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('STORAGE_SECRET_ACCESS_KEY');
    this.bucketName = this.configService.get<string>('STORAGE_BUCKET_NAME') || 'dexa-bucket';
    const forcePathStyle = this.configService.get<string>('STORAGE_FORCE_PATH_STYLE') === 'true';
    this.publicUrl = this.configService.get<string>('STORAGE_PUBLIC_URL');

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: region,
      credentials: {
        accessKeyId: accessKeyId || 'minioadmin',
        secretAccessKey: secretAccessKey || 'minioadmin',
      },
      forcePathStyle: forcePathStyle,
    });
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
