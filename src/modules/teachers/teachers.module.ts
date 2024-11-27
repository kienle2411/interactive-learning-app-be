import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { AuthService } from '../auth/auth.service';
import { RolesService } from '../roles/roles.service';
import { StudentsService } from '../students/students.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { MediasService } from '../medias/medias.service';

@Module({
  providers: [
    TeachersService,
    PrismaService,
    UsersService,
    PasswordService,
    RolesService,
    TeachersService,
    StudentsService,
    CloudinaryService,
    MediasService,
  ],
  controllers: [TeachersController],
})
export class TeachersModule {}
