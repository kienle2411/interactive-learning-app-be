import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Classroom } from '@prisma/client';

@Injectable()
export class ClassroomsService {
  constructor(private readonly prisma: PrismaService) {}

  async createClassroom(
    createClassroomDto: CreateClassroomDto,
  ): Promise<Classroom> {
    return this.prisma.classroom.create({
      data: {
        ...createClassroomDto,
      },
    });
  }
}
