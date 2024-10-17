import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/password/password.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from './constants';

import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { TeachersService } from 'src/teachers/teachers.service';
import { StudentsService } from 'src/students/students.service';
dotenv.config();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    PasswordService,
    LocalStrategy,
    TeachersService,
    StudentsService,
  ],
})
export class AuthModule {}
