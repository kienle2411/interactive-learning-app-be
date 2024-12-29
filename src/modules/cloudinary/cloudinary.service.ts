import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadSingleFile(filePath: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        { folder: 'pptx-conversions' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }

  async uploadFileFromPath(
    filePaths: string | string[],
  ): Promise<UploadApiResponse | UploadApiResponse[]> {
    try {
      if (typeof filePaths === 'string') {
        return await this.uploadSingleFile(filePaths);
      }

      if (Array.isArray(filePaths)) {
        const uploadPromises = filePaths.map((path) =>
          this.uploadSingleFile(path),
        );
        const results = await Promise.all(uploadPromises);
        return results;
      }

      throw new Error(
        'Invalid input: filePaths must be a string or array of strings',
      );
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}
