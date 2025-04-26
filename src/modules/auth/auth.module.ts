import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '@/modules/user/user.service';
import { UserModule } from '@/modules/user/user.module';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/modules/password/password.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { TeacherService } from '@/modules/teacher/teacher.service';
import { StudentService } from '@/modules/student/students.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { EmailService } from '../email/email.service';
dotenv.config();

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    PasswordService,
    TeacherService,
    StudentService,
    JwtService,
    JwtStrategy,
    RefreshTokenStrategy,
    CloudinaryService,
    EmailService,
  ],
})
export class AuthModule {}
