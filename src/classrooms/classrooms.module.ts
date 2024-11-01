import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from 'src/password/password.service';
import { RolesService } from 'src/roles/roles.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { StudentsService } from 'src/students/students.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { PaginationMiddleware } from 'src/middlewares/pagination.middleware';

@Module({
  providers: [
    ClassroomsService,
    PrismaService,
    UsersService,
    PasswordService,
    RolesService,
    TeachersService,
    StudentsService,
    SessionsService,
  ],
  controllers: [ClassroomsController],
})
export class ClassroomsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes(ClassroomsController);
  }
}
