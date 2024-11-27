import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { PrismaService } from '@/prisma.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MediasService } from '../medias/medias.service';
import { TeachersService } from '../teachers/teachers.service';
import { StudentsService } from '../students/students.service';

@Module({
  providers: [
    AssignmentsService,
    PrismaService,
    UsersService,
    RolesService,
    CloudinaryService,
    MediasService,
    TeachersService,
    StudentsService,
  ],
  controllers: [AssignmentsController],
})
export class AssignmentsModule {}
