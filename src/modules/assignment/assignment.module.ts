import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { PrismaService } from '@/prisma.service';
import { UserService } from '../user/user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TeacherService } from '../teacher/teacher.service';
import { StudentService } from '../student/students.service';
import { FileService } from '../file/file.service';
import { DropboxService } from '../dropbox/dropbox.service';

@Module({
  providers: [
    AssignmentService,
    PrismaService,
    UserService,
    CloudinaryService,
    TeacherService,
    StudentService,
    FileService,
    DropboxService,
  ],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
