import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FileService } from './file.service';
import { DropboxService } from '../dropbox/dropbox.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':id/download')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async downloadFile(@Param('id') fileId: string) {
    return await this.fileService.download(fileId);
  }
}
