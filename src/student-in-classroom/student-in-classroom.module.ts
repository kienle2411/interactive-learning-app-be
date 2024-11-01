import { Module } from '@nestjs/common';
import { StudentInClassroomService } from './student-in-classroom.service';
import { StudentInClassroomController } from './student-in-classroom.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from 'src/password/password.service';
import { RolesService } from 'src/roles/roles.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { StudentsService } from 'src/students/students.service';

@Module({
  providers: [
    StudentInClassroomService,
    PrismaService,
    UsersService,
    PasswordService,
    RolesService,
    TeachersService,
    StudentsService,
  ],
  controllers: [StudentInClassroomController],
})
export class StudentInClassroomModule {}
