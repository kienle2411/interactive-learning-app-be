import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [RolesService, PrismaService],
  controllers: [RolesController],
})
export class RolesModule {}
