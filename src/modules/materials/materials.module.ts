import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  providers: [MaterialsService, PrismaService],
  controllers: [MaterialsController],
})
export class MaterialsModule {}
