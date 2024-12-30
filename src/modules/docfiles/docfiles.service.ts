import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateDocFileDto } from './dto/create-docfile.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as libre from 'libreoffice-convert';
import { promisify } from 'util';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { execSync } from 'child_process';

const convertAsync = promisify(libre.convert);

@Injectable()
export class DocfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async convertPPTXtoPNG(file: Express.Multer.File) {
    const inputFilePath = file.path;
    const outputDir = path.join(
      './upload/converted',
      path.parse(file.filename).name,
    );
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputFilePath = path.join(
      outputDir,
      `${path.parse(file.filename).name}`,
    );

    try {
      const command = `libreoffice --headless --convert-to-png --outdir "${outputDir}" "${inputFilePath}`;
      execSync(command);
      const pngFiles = fs
        .readdirSync(outputDir)
        .map((file) => path.join(outputDir, file));
      const uploadPromises = pngFiles.map((pngFile) =>
        this.cloudinary.uploadSingleFile(pngFile),
      );
      const uploadResults = await Promise.all(uploadPromises);
      fs.unlinkSync(inputFilePath);
      pngFiles.forEach((file) => fs.unlinkSync(file));
      return {
        message: 'Upload successfully!',
        slides: uploadResults.map((result) => result.secureUrl),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }

    // try {
    //   const data = await convertAsync(
    //     fs.readFileSync(inputFilePath),
    //     '.pdf',
    //     undefined,
    //   );

    //   const dataC = await convertAsync(data, '.png', undefined);

    //   fs.writeFileSync(path.join(outputDir, 'png'), dataC);

    //   // const slides = data.toString().split('\r\n\r\n');

    //   // slides.forEach((pngData, index) => {
    //   //   fs.writeFileSync(path.join(outputFilePath, `${index + 1}`), pngData);
    //   //   this.cloudinary.uploadFileFromPath(
    //   //     path.join(outputFilePath, `${index + 1}`),
    //   //   );
    //   // });

    //   //  fs.writeFileSync(outputFilePath, data);

    //   // fs.unlinkSync(inputFilePath);
    //   // fs.unlinkSync(outputFilePath);
    // } catch (error) {
    //   throw error;
    // }
  }
}
