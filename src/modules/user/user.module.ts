import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/modules/password/password.service';
import { StudentService } from '@/modules/student/students.service';
import { TeacherService } from '@/modules/teacher/teacher.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { AssignmentService } from '../assignment/assignment.service';
import { FileService } from '../file/file.service';
import { DropboxService } from '../dropbox/dropbox.service';

@Module({
  providers: [
    AuthService,
    UserService,
    PrismaService,
    PasswordService,
    TeacherService,
    StudentService,
    JwtService,
    CloudinaryService,
    AssignmentService,
    FileService,
    DropboxService,
  ],
  controllers: [UserController],
})
export class UserModule {}
