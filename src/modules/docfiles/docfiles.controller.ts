import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  SetMetadata,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DocfilesService } from './docfiles.service';
import { DropboxService } from '../dropbox/dropbox.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import moment from 'moment';
import { PrismaService } from '@/prisma.service';
import { CreateDocFileDto } from './dto/create-docfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { ApiBearerAuth } from '@nestjs/swagger';
import path from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';

@ApiBearerAuth()
@Controller('docfiles')
export class DocfilesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly docFilesService: DocfilesService,
    private readonly dropboxService: DropboxService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
    }),
  )
  @UseGuards(JwtAuthGuard)
  async uploadDocFile(
    @Req() req: Request,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    try {
      const convertExtensions = ['.pptx', '.ppt'];
      const fileExtension = path.extname(file.originalname).toLocaleLowerCase();
      if (convertExtensions.includes(fileExtension)) {
        await this.docFilesService.convertPPTXtoPNG(file);
      }
      const result = await Promise.race([
        this.dropboxService.uploadFile(file, req.user['sub']),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 60000),
        ),
      ]);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Upload failed: ' + error.message);
    } finally {
      try {
        await fs.promises.unlink(file.path);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    }
  }

  @Get(':id/download')
  @SetMetadata('skipProvider', true)
  async downloadDocFile(
    @Param('id') docFileId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const link = await this.dropboxService.downloadFile(docFileId);
    return res.redirect(link);
  }
}
