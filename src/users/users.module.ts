import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';

@Module({
  providers: [
    UsersService,
    PrismaService,
    PasswordService,
    StudentsService,
    TeachersService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
