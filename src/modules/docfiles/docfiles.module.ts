import { Module } from '@nestjs/common';
import { DocfilesService } from './docfiles.service';
import { DocfilesController } from './docfiles.controller';
import { PrismaService } from '@/prisma.service';
import { DropboxService } from '../dropbox/dropbox.service';

@Module({
  providers: [DocfilesService, PrismaService, DropboxService],
  controllers: [DocfilesController],
})
export class DocfilesModule {}
