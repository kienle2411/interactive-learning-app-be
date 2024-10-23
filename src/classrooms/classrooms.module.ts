import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ClassroomsService, PrismaService],
  controllers: [ClassroomsController],
})
export class ClassroomsModule {}
