import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { PrismaService } from '@/prisma.service';
import { UserService } from '../user/user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TeacherService } from '../teacher/teacher.service';
import { StudentService } from '../student/students.service';

@Module({
  controllers: [AnswerController],
  providers: [
    AnswerService,
    PrismaService,
    UserService,
    CloudinaryService,
    TeacherService,
    StudentService,
  ],
})
export class AnswersModule {}
