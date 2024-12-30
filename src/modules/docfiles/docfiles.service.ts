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

    const pngDir = path.join(
      outputDir,
      `png-${path.parse(file.filename).name}`,
    );
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(pngDir)) {
      fs.mkdirSync(pngDir, { recursive: true });
    }

    try {
      const convertToPDFCommand = `soffice --convert-to pdf --outdir '${outputDir}' '${inputFilePath}' --headless`;
      execSync(convertToPDFCommand);
      const pdfFilePath = path.join(
        outputDir,
        `${path.parse(file.filename).name}.pdf`,
      );
      const convertToPNGCommand = `pdftoppm '${pdfFilePath}' '${pngDir}/slide' -jpeg`;
      execSync(convertToPNGCommand);
      const pngFiles = fs
        .readdirSync(pngDir)
        .map((file) => path.join(pngDir, file));
      const uploadPromises = pngFiles.map((pngFile) =>
        this.cloudinary.uploadSingleFile(pngFile),
      );
      const uploadResults = await Promise.all(uploadPromises);
      fs.unlinkSync(inputFilePath);
      fs.unlinkSync(pdfFilePath);
      pngFiles.forEach((file) => fs.unlinkSync(file));
      fs.rmdirSync(pngDir, { recursive: true });
      return {
        message: 'Upload successfully!',
        slides: uploadResults.map((result) => result.secure_url),
      };
    } catch (error) {
      console.log(error);
      throw new Error('Failed');
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
