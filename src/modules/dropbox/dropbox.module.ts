import { Module } from '@nestjs/common';
import { DropboxService } from './dropbox.service';
import { PrismaService } from '@/prisma.service';

@Module({
  providers: [DropboxService, PrismaService],
})
export class DropboxModule {}
