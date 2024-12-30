import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Classroom, Material, Prisma, SessionStatus } from '@prisma/client';
import { UsersService } from 'src/modules/users/users.service';
import { UpdateClassroomDto } from './dto/update-classroom-dto';
import { PaginationHelper } from '@/common/helpers';
import { CreateMaterialDto } from '../materials/dto/create-material.dto';
import { DropboxService } from '../dropbox/dropbox.service';
import { CreateAssignmentDto } from '../assignments/dto/create-assignment.dto';
import { CreateGroupDto } from '../groups/dto/create-group.dto';
import { CreateSessionDto } from '../sessions/dto/create-session.dto';

@Injectable()
export class ClassroomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly dropboxService: DropboxService,
  ) {}

  async createClassroom(
    createClassroomDto: CreateClassroomDto,
    userId: string,
  ) {
    const teacherId = await this.usersService.getTeacherIdByUserId(userId);
    return await this.prisma.classroom.create({
      data: {
        ...createClassroomDto,
        teacherId,
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
    userId: string,
    classroomId: string,
    createMaterialDto: CreateMaterialDto,
    file?: Express.Multer.File,
  ): Promise<Material> {
    if (file) {
      const response = await this.dropboxService.uploadFile(file, userId);
      return this.prisma.material.create({
        data: {
          ...createMaterialDto,
          classroomId: classroomId,
          docFileId: response.docFile.id,
        },
      });
    }
    return this.prisma.material.create({
      data: {
        ...createMaterialDto,
        classroomId: classroomId,
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

  async createClassroomAssignment(
    classroomId: string,
    createClassroomAssignment: CreateAssignmentDto,
  ) {
    return this.prisma.assignment.create({
      data: {
        ...createClassroomAssignment,
        classroomId: classroomId,
      },
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
              id: true,
              user: true,
              groups: true,
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

  async createClassroomGroup(
    classroomId: string,
    createGroupDto: CreateGroupDto,
  ) {
    return this.prisma.group.create({
      data: {
        ...createGroupDto,
        classroomId: classroomId,
      },
    });
  }

  async getClassroomSessions(
    classroomId: string,
    page: number = 1,
    limit: number = 0,
  ) {
    return PaginationHelper.paginate(
      this.prisma.session,
      { classroomId },
      { page, limit },
    );
  }

  async createClassroomSession(
    classroomId: string,
    createSessionDto: CreateSessionDto,
  ) {
    const now = new Date();
    const startDate = new Date(createSessionDto.startTime);
    const endDate = new Date(createSessionDto.endTime);
    const status =
      startDate > now
        ? SessionStatus.SCHEDULED
        : endDate > now
          ? SessionStatus.INPROGRESS
          : SessionStatus.COMPLETED;
    return this.prisma.session.create({
      data: {
        ...createSessionDto,
        status: status,
      },
    });
  }
}
