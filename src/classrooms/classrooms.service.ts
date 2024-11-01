import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Classroom } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { UpdateClassroomDto } from './dto/update-classroom-dto';

@Injectable()
export class ClassroomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async createClassroom(
    createClassroomDto: CreateClassroomDto,
  ): Promise<Classroom> {
    return this.prisma.classroom.create({
      data: {
        ...createClassroomDto,
      },
    });
  }

  async deleteClass(classroomId: string) {
    return this.prisma.classroom.update({
      where: { id: classroomId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getClassroomInformation(classroomId: string) {
    return this.prisma.classroom.findUnique({
      where: { id: classroomId },
    });
  }

  async updateClassroomInformation(
    classroomId: string,
    updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.prisma.classroom.update({
      where: { id: classroomId },
      data: {
        ...updateClassroomDto,
      },
    });
  }

  async getAllClassroomByTeacher(
    userId: string,
    page: number = 1,
    limit: number = 0,
    skip: number = 0,
  ) {
    const teacherId = await this.usersService.getTeacherIdByUserId(userId);

    const classrooms = await this.prisma.classroom.findMany({
      where: { teacherId },
      ...(limit > 0 ? { skip, take: limit } : {}),
      orderBy: { createdAt: 'asc' },
    });

    const totalClassroom = await this.prisma.classroom.count({
      where: { teacherId },
    });

    const lastPage = Math.ceil(totalClassroom / limit);
    if (page > lastPage) {
      throw new BadRequestException(
        `Page ${page} does not exist. Total pages: ${lastPage}`,
      );
    }

    return {
      data: classrooms,
      total: totalClassroom,
      page,
      lastPage: lastPage,
    };
  }
}
