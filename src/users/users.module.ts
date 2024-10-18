import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { RolesService } from 'src/roles/roles.service';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    PasswordService,
    StudentsService,
    TeachersService,
    RolesService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
