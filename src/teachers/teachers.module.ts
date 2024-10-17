import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [TeachersService, PrismaService],
  controllers: [TeachersController],
})
export class TeachersModule {}
