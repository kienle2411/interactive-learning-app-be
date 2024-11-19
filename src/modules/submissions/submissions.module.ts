import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  providers: [SubmissionsService, PrismaService],
  controllers: [SubmissionsController],
})
export class SubmissionsModule {}
