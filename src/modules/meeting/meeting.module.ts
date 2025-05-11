import { Module } from '@nestjs/common';
import { MeetingGateway } from './meeting.gateway';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TeacherService } from '../teacher/teacher.service';
import { StudentService } from '../student/students.service';

@Module({
  providers: [
    MeetingGateway,
    AuthService,
    UserService,
    PasswordService,
    JwtService,
    PrismaService,
    CloudinaryService,
    TeacherService,
    StudentService,
  ],
})
export class MeetingModule {}
