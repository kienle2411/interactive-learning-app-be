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
      `${path.parse(file.filename).name}`,
    );

    try {
      const data = await convertAsync(
        fs.readFileSync(inputFilePath),
        '.pdf',
        undefined,
      );

      const dataC = await convertAsync(data, '.png', undefined);

      fs.writeFileSync(path.join(outputDir, 'png'), dataC);

      // const slides = data.toString().split('\r\n\r\n');

      // slides.forEach((pngData, index) => {
      //   fs.writeFileSync(path.join(outputFilePath, `${index + 1}`), pngData);
      //   this.cloudinary.uploadFileFromPath(
      //     path.join(outputFilePath, `${index + 1}`),
      //   );
      // });

      //  fs.writeFileSync(outputFilePath, data);

      // fs.unlinkSync(inputFilePath);
      // fs.unlinkSync(outputFilePath);
    } catch (error) {
      throw error;
    }
  }
}
