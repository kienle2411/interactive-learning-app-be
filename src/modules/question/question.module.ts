import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaService } from '@/prisma.service';
import { UserService } from '../user/user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TeacherService } from '../teacher/teacher.service';
import { StudentService } from '../student/students.service';

@Module({
  providers: [
    QuestionService,
    PrismaService,
    UserService,
    CloudinaryService,
    TeacherService,
    StudentService,
  ],
  controllers: [QuestionController],
})
export class QuestionModule {}
