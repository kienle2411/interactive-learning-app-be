import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  async createTeacher(userId: string, subject?: string) {
    return this.prisma.teacher.create({
      data: {
        userId: userId,
        subjectSpecialization: subject,
      },
    });
  }
}
