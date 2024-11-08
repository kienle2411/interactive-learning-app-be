import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Classroom, Material } from '@prisma/client';
import { UsersService } from 'src/modules/users/users.service';
import { UpdateClassroomDto } from './dto/update-classroom-dto';
import { PaginationHelper } from '@/common/helpers';
import { CreateMaterialDto } from '../materials/dto/create-material.dto';

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

  async getClassroomMaterials(
    classroomId: string,
    page: number = 1,
    limit: number = 0,
  ) {
    return PaginationHelper.paginate(
      this.prisma.material,
      { classroomId },
      { page, limit },
    );
  }

  async createClassroomMaterial(
    createMaterialDto: CreateMaterialDto,
  ): Promise<Material> {
    return this.prisma.material.create({
      data: {
        ...createMaterialDto,
      },
    });
  }

  async getClassroomAssignments(
    classroomId: string,
    page: number = 1,
    limit: number = 0,
  ) {
    return PaginationHelper.paginate(
      this.prisma.assignment,
      { classroomId },
      { page, limit },
    );
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

  async getClassroomStudents(
    classroomId: string,
    page: number = 1,
    limit: number = 0,
  ) {
    return PaginationHelper.paginate(
      this.prisma.studentInClassroom,
      { classroomId },
      { page, limit },
      {
        select: {
          student: {
            select: {
              user: true,
            },
          },
          totalScore: true,
        },
      },
    );
  }

  async getClassroomGroups(
    classroomId: string,
    page: number = 1,
    limit: number = 0,
  ) {
    return PaginationHelper.paginate(
      this.prisma.group,
      { classroomId },
      { page, limit },
    );
  }
}
