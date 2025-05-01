import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaService } from '@/prisma.service';
import { UserService } from '../user/user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TeacherService } from '../teacher/teacher.service';
import { StudentService } from '../student/students.service';

@Module({
  providers: [
    QuizService,
    PrismaService,
    UserService,
    CloudinaryService,
    TeacherService,
    StudentService,
  ],
  controllers: [QuizController],
})
export class QuizModule {}
