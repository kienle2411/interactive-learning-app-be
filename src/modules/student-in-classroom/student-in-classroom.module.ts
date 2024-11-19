import { Module } from '@nestjs/common';
import { StudentInClassroomService } from './student-in-classroom.service';
import { StudentInClassroomController } from './student-in-classroom.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/modules/users/users.service';
import { RolesService } from 'src/modules/roles/roles.service';
import { TeachersService } from 'src/modules/teachers/teachers.service';
import { StudentsService } from 'src/modules/students/students.service';
import { PasswordService } from 'src/modules/password/password.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { MediasService } from '../medias/medias.service';

@Module({
  providers: [
    StudentInClassroomService,
    PrismaService,
    UsersService,
    PasswordService,
    RolesService,
    TeachersService,
    StudentsService,
    CloudinaryService,
    MediasService,
  ],
  controllers: [StudentInClassroomController],
})
export class StudentInClassroomModule {}
