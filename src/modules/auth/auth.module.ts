import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { UsersModule } from 'src/modules/users/users.module';
import { PrismaService } from 'src/prisma.service';
import { PasswordService } from 'src/modules/password/password.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { TeachersService } from 'src/modules/teachers/teachers.service';
import { StudentsService } from 'src/modules/students/students.service';
import { JwtStrategy } from './guard/jwt.strategy';
import { RolesModule } from 'src/modules/roles/roles.module';
import { RolesService } from 'src/modules/roles/roles.service';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
dotenv.config();

@Module({
  imports: [UsersModule, RolesModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    RolesService,
    PasswordService,
    TeachersService,
    StudentsService,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
