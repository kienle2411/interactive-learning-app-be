import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/modules/password/password.service';
import { StudentsService } from 'src/modules/students/students.service';
import { TeachersService } from 'src/modules/teachers/teachers.service';
import { RolesService } from 'src/modules/roles/roles.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    PasswordService,
    TeachersService,
    StudentsService,
    RolesService,
    JwtService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
