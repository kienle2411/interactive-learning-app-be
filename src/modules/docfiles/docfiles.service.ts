import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDocFileDto } from './dto/create-docfile.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as libre from 'libreoffice-convert';
import { promisify } from 'util';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

const convertAsync = promisify(libre.convert);

@Injectable()
export class DocfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async convertPPTXtoPNG(file: Express.Multer.File) {
    const outputDir = path.join('./uploads/converted');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const inputFilePath = file.path;
    const outputFilePath = path.join(
      outputDir,
      `${path.parse(file.filename).name}.png`,
    );

    try {
      const data = await convertAsync(
        fs.readFileSync(inputFilePath),
        '.png',
        undefined,
      );

      fs.writeFileSync(outputFilePath, data);

      const cloudinaryResponse =
        await this.cloudinary.uploadFileFromPath(outputFilePath);

      fs.unlinkSync(inputFilePath);
      fs.unlinkSync(outputFilePath);

      return {
        cloudinaryUrl: cloudinaryResponse.secureUrl,
      };
    } catch (error) {
      throw error;
    }
  }
}
