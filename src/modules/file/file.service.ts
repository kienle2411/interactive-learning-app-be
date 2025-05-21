import { DropboxService } from '@/modules/dropbox/dropbox.service';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs-extra';
import { promisify } from 'util';
import { exec } from 'child_process';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const execAsync = promisify(exec);

@Injectable()
export class FileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dropboxService: DropboxService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async deleteMaterialFile(materialId: string) {
    return this.prisma.file.updateMany({
      where: { materialId: materialId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async createFile(
    file: Express.Multer.File,
    userId: string,
    materialId?: string,
  ) {
    const response = await this.dropboxService.uploadFile(file, userId);
    if (!response) {
      throw new Error('Failed to upload file to Dropbox');
    }
    if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      const uploadedFile = await this.prisma.file.create({
        data: {
          type: file.originalname.split('.')[1].toUpperCase(),
          name: file.originalname,
          uploadedBy: userId,
          url: response.result.path_lower,
          materialId: materialId,
        },
      });
      await this.convertPPTXToPNG(file, uploadedFile.id);
      return uploadedFile;
    } else {
      return this.prisma.file.create({
        data: {
          type: file.originalname.split('.')[1].toUpperCase(),
          name: file.originalname,
          uploadedBy: userId,
          url: response.result.path_lower,
          materialId: materialId,
        },
      });
    }
  }

  async convertPPTXToPNG(file: Express.Multer.File, fileId: string) {
    const tempDir = path.join(__dirname, '..', '..', Date.now().toString());
    const tempInputPath = path.join(tempDir, 'input.pptx');
    const tempPDFPath = path.join(tempDir, 'input.pdf');
    const outputDir = path.join(tempDir, 'output');
    await fs.ensureDir(tempDir);
    await fs.ensureDir(outputDir);
    await fs.writeFile(tempInputPath, file.buffer);

    try {
      const convertToPDFCommand = `soffice --headless --convert-to pdf --outdir "${tempDir}" "${tempInputPath}"`;
      await execAsync(convertToPDFCommand);

      console.log('Checking for PDF:', tempPDFPath);
      console.log('Exists?', await fs.pathExists(tempPDFPath));

      const convertToPNGCommand = `pdftoppm -png "${tempPDFPath}" "${path.join(outputDir, 'slide')}"`;
      await execAsync(convertToPNGCommand);

      const convertedFiles = await fs.readdir(outputDir);
      console.log('Converted files:', convertedFiles);

      const pngFiles = convertedFiles
        .filter((file) => file.endsWith('.png'))
        .sort((a, b) => a.localeCompare(b))
        .map((file) => path.join(outputDir, file));

      const uploadedUrls: string[] = [];

      for (const filePath of pngFiles) {
        const result = await this.cloudinaryService.uploadSingleFile(filePath);
        uploadedUrls.push(result.secure_url);
      }

      await this.prisma.slidePage.createMany({
        data: uploadedUrls.map((url, index) => ({
          slideOrder: index,
          slideUrl: url,
          fileId: fileId,
        })),
      });

      await fs.remove(tempDir);
      await fs.remove(outputDir);
      await fs.remove(tempInputPath);

      return uploadedUrls;
    } catch (error) {
      throw error;
    }
  }

  async download(fileId: string) {
    return this.dropboxService.downloadFile(fileId);
  }
}
