import { Module } from '@nestjs/common';
import { StudentService } from './students.service';
import { StudentController } from './student.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '@/modules/user/user.service';
import { UserModule } from '@/modules/user/user.module';
import { PasswordService } from 'src/modules/password/password.service';
import { TeacherService } from '@/modules/teacher/teacher.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

@Module({
  providers: [
    StudentService,
    PrismaService,
    UserService,
    PasswordService,
    TeacherService,
    CloudinaryService,
  ],
  controllers: [StudentController],
  imports: [UserModule],
})
export class StudentModule {}
