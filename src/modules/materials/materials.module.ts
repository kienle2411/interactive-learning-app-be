import { Module } from '@nestjs/common';
import { MaterialService } from './materials.service';
import { MaterialController } from './materials.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  providers: [MaterialService, PrismaService],
  controllers: [MaterialController],
})
export class MaterialModule {}
