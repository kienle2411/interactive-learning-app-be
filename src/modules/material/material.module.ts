import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { PrismaService } from '@/prisma.service';
import { FileService } from '../file/file.service';
import { DropboxService } from '../dropbox/dropbox.service';

@Module({
  providers: [MaterialService, PrismaService, FileService, DropboxService],
  controllers: [MaterialController],
})
export class MaterialModule {}
