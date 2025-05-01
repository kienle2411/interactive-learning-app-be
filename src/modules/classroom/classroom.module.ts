import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '@/modules/user/user.service';
import { PasswordService } from 'src/modules/password/password.service';
import { TeacherService } from '@/modules/teacher/teacher.service';
import { StudentService } from '@/modules/student/students.service';
import { SessionService } from '@/modules/session/session.service';
import { DropboxService } from '../dropbox/dropbox.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { FileService } from '../file/file.service';
import { GroupService } from '../group/group.service';
import { MaterialService } from '../material/material.service';

@Module({
  providers: [
    ClassroomService,
    PrismaService,
    PasswordService,
    UserService,
    TeacherService,
    StudentService,
    SessionService,
    DropboxService,
    CloudinaryService,
    FileService,
    GroupService,
    MaterialService,
  ],
  controllers: [ClassroomController],
})
export class ClassroomModule {}
