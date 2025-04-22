import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';
import { AuthService } from '../auth/auth.service';
import { StudentService } from '../student/students.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

@Module({
  providers: [
    TeacherService,
    PrismaService,
    UserService,
    PasswordService,
    TeacherService,
    StudentService,
    CloudinaryService,
  ],
  controllers: [TeacherController],
})
export class TeacherModule {}
