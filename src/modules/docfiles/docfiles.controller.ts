import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DocfilesService } from './docfiles.service';
import { DropboxService } from '../dropbox/dropbox.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import moment from 'moment';
import { PrismaService } from '@/prisma.service';
import { CreateDocFileDto } from './dto/create-docfile.dto';

@Controller('docfiles')
export class DocfilesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly docFilesService: DocfilesService,
    private readonly dropboxService: DropboxService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  async uploadDocFile(@Req() req, @Body() body: { filePath: string }) {
    const { filePath } = body;
    return this.dropboxService.uploadFile(filePath, req.user.userId);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  async downloadDocFile(@Param('id') docFileId: string) {
    return this.dropboxService.downloadFile(docFileId);
  }
}
