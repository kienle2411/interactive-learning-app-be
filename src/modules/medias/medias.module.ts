import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [MediasController],
  providers: [MediasService, PrismaService],
})
export class MediasModule {}
