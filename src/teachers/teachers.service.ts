import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: {
        userId: createTeacherDto.userId,
        subjectSpecialization: createTeacherDto.subjectSpecialization,
      },
    });
  }
}
