import { Module } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { ChoiceController } from './choice.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  providers: [ChoiceService, PrismaService],
  controllers: [ChoiceController],
})
export class ChoiceModule {}
