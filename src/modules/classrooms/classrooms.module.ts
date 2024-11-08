import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/modules/users/users.service';
import { PasswordService } from 'src/modules/password/password.service';
import { RolesService } from 'src/modules/roles/roles.service';
import { TeachersService } from 'src/modules/teachers/teachers.service';
import { StudentsService } from 'src/modules/students/students.service';
import { SessionsService } from 'src/modules/sessions/sessions.service';

@Module({
  providers: [
    ClassroomsService,
    PrismaService,
    PasswordService,
    UsersService,
    RolesService,
    TeachersService,
    StudentsService,
    SessionsService,
  ],
  controllers: [ClassroomsController],
})
export class ClassroomsModule {}
