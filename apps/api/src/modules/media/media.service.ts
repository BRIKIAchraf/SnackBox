import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;
  private readonly logger = new Logger(MediaService.name);

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('CLOUDFLARE_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('CLOUDFLARE_SECRET_ACCESS_KEY');
    
    this.bucketName = this.configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME') || 'pizza-assets';
    this.publicUrl = this.configService.get<string>('CLOUDFLARE_R2_PUBLIC_URL') || '';

    if (accountId && accessKeyId && secretAccessKey) {
        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    } else {
        this.logger.warn('Cloudflare R2 credentials missing. Image uploads will use local mock storage.');
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'products'): Promise<string> {
    if (!this.s3Client) {
        // Mock implementation for local dev if credentials are missing
        const fileName = `${uuidv4()}-${file.originalname}`;
        this.logger.log(`Mocking upload for ${fileName} to folder ${folder}`);
        return `https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800`; // Return a nice pizza image as fallback
    }

    const key = `${folder}/${uuidv4()}-${file.originalname}`;
    
    try {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return `${this.publicUrl}/${key}`;
    } catch (error) {
        this.logger.error(`Failed to upload to Cloudflare R2: ${error.message}`);
        throw error;
    }
  }

  async uploadFiles(files: Express.Multer.File[], folder: string = 'products'): Promise<string[]> {
    return Promise.all(files.map(file => this.uploadFile(file, folder)));
  }
}
