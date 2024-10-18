import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [StudentsService, PrismaService],
  controllers: [StudentsController],
})
export class StudentsModule {}
