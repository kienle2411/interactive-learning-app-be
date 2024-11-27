import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { DocfilesService } from './docfiles.service';
import { DropboxService } from '../dropbox/dropbox.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import moment from 'moment';
import { PrismaService } from '@/prisma.service';
import { CreateDocFileDto } from './dto/create-docfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';

@Controller('docfiles')
export class DocfilesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly docFilesService: DocfilesService,
    private readonly dropboxService: DropboxService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async uploadDocFile(
    @Req() req,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.dropboxService.uploadFile(file, req.user.userId);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  async downloadDocFile(
    @Param('id') docFileId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const link = await this.dropboxService.downloadFile(docFileId);
    return res.redirect(link);
  }
}
