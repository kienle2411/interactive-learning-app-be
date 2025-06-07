import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Material } from '@prisma/client';
import { UserService } from '@/modules/user/user.service';
import { UpdateClassroomDto } from './dto/update-classroom-dto';
import { PaginationHelper } from '@/common/helpers';
import { CreateMaterialDto } from '../material/dto/create-material.dto';
import { DropboxService } from '../dropbox/dropbox.service';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { CreateSessionDto } from '../session/dto/create-session.dto';
import { CreateMeetingDto } from '@/modules/meeting/dto/create-meeting.dto';
import { FileService } from '@/modules/file/file.service';
import { GroupService } from '../group/group.service';
import { MaterialService } from '../material/material.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class ClassroomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly dropboxService: DropboxService,
    private readonly fileService: FileService,
    private readonly groupService: GroupService,
    private readonly materialService: MaterialService,
    private readonly sessionService: SessionService,
  ) {}

  async createClassroom(
    createClassroomDto: CreateClassroomDto,
    userId: string,
  ) {
    const teacherId = await this.userService.getTeacherIdByUserId(userId);
    return await this.prisma.classroom.create({
      data: {
        ...createClassroomDto,
        teacherId,
      },
    });
  }

  async deleteClassroom(classroomId: string) {
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
      {
        include: {
          file: true,
        },
      },
    );
  }

  async createClassroomMaterial(
    userId: string,
    classroomId: string,
    createMaterialDto: CreateMaterialDto,
    file?: Express.Multer.File,
  ): Promise<Material> {
    return await this.materialService.createMaterial(
      userId,
      classroomId,
      createMaterialDto,
      file,
    );
  }

  async deleteClassroomMaterial(materialId: string) {
    const material = await this.prisma.material.findUnique({
      where: { id: materialId },
    });
    if (!material) {
      throw new UnauthorizedException('Material not found');
    }
    await this.fileService.deleteMaterialFile(materialId);
    return this.prisma.material.update({
      where: { id: materialId },
      data: {
        deletedAt: new Date(),
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
      {
        select: {
          id: true,
          startTime: true,
          dueTime: true,
          title: true,
          description: true,
          assignmentType: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          score: true,
          classroomId: true,
          classroom: true,
          submissions: true,
          questions: true,
          StudentInAssignment: true,
        },
      },
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
      this.prisma.studentClassroom,
      { classroomId },
      { page, limit },
      {
        select: {
          id: true,
          studentId: true,
          classroomId: true,
          score: true,
          joinedAt: true,
          leftAt: true,
          deletedAt: true,
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  dateOfBirth: true,
                  avatarUrl: true,
                },
              },
              studentGroup: {
                where: {
                  classroomId: classroomId,
                },
                include: {
                  group: true,
                },
              },
            },
          },
          classroom: {
            select: {
              id: true,
              name: true,
              code: true,
              description: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
          },
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
    return await this.groupService.createGroup(createGroupDto, classroomId);
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
    file: Express.Multer.File,
    createSessionDto: CreateSessionDto,
    userId: string,
  ) {
    return await this.sessionService.createSession(
      classroomId,
      userId,
      createSessionDto,
      file,
    );
  }

  async getClassroomMeetings(
    classroomId: string,
    page: number = 1,
    limit: number = 0,
  ) {
    return PaginationHelper.paginate(
      this.prisma.meeting,
      { classroomId },
      { page, limit },
    );
  }

  async createClassroomMeeting(
    classroomId: string,
    userId: string,
    createMeetingDto: CreateMeetingDto,
  ) {
    const teacherId = await this.userService.getTeacherIdByUserId(userId);
    return this.prisma.meeting.create({
      data: {
        ...createMeetingDto,
        classroomId,
        hostId: teacherId,
        createdBy: userId,
      },
    });
  }

  async joinClassroom(code: string, userId: string) {
    const studentId = await this.userService.getStudentIdByUserId(userId);
    const classroom = await this.prisma.classroom.findUnique({
      where: { code },
    });
    if (!classroom) {
      throw new UnauthorizedException('Classroom not found');
    }
    return this.prisma.studentClassroom.create({
      data: {
        studentId,
        classroomId: classroom.id,
      },
    });
  }

  async leaveClassroom(classroomId: string, userId: string) {
    const studentId = await this.userService.getStudentIdByUserId(userId);
    return this.prisma.studentClassroom.update({
      where: {
        studentId_classroomId: {
          studentId,
          classroomId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
