import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/modules/users/users.service';
import { UsersModule } from 'src/modules/users/users.module';
import { PasswordService } from 'src/modules/password/password.service';
import { RolesService } from 'src/modules/roles/roles.service';
import { TeachersService } from 'src/modules/teachers/teachers.service';

@Module({
  providers: [
    StudentsService,
    PrismaService,
    UsersService,
    PasswordService,
    RolesService,
    TeachersService,
  ],
  controllers: [StudentsController],
  imports: [UsersModule],
})
export class StudentsModule {}
