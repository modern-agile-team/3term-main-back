import * as path from 'path';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'), // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      region: this.configService.get('AWS_S3_REGION'),
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  async uploadFileToS3(
    folder: string,
    files: Express.Multer.File,
  ): Promise<{
    keys: Array<string>;
    // s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
  }> {
    try {
      const keys = [];

      for (const index in files) {
        const key: string = `${folder}/${Date.now()}_${path.basename(
          files[index].originalname,
        )}`.replace(/ /g, '');

        sharp(files[index].buffer)
          .resize({ width: 100 }) // 비율을 유지하며 가로 크기 줄이기
          .withMetadata() // 이미지의 exif데이터 유지
          .toBuffer((err, buffer) => {
            if (err) {
              throw err;
            }

            this.awsS3
              .putObject({
                Bucket: this.S3_BUCKET_NAME,
                Key: key,
                Body: buffer,
                ACL: 'public-read',
                ContentType: files[index].mimetype,
              })
              .promise();
          });

        keys.push(key);
      }

      return { keys, contentType: files.mimetype };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  public getAwsS3FileUrl(objectKey: string) {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  }

  // upload = multer({
  //   storage: s3Storage({
  //     s3: awsS3,
  //     bucket: this.S3,
  //     acl: 'public-read',
  //     key: function (request, file, cb) {
  //       cb(null, `${Date.now().toString()} - ${file.originalname}`);
  //     },
  //     resize: {
  //       width: 600,
  //       height: 400,
  //     },
  //   }),
  // }).array('upload', 1);
}
