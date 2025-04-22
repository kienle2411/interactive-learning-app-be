import { PaginationHelper } from '@/common/helpers';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddStudentGroupDto } from './dto/add-student-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(createGroupDto: CreateGroupDto, classroomId: string) {
    return await this.prisma.group.create({
      data: {
        ...createGroupDto,
        classroomId: classroomId,
      },
    });
  }

  async getGroupInformation(groupId: string) {
    return await this.prisma.group.findUnique({
      where: { id: groupId },
    });
  }

  async getGroupMembers(groupId: string, page: number = 1, limit: number = 0) {
    return PaginationHelper.paginate(
      this.prisma.studentGroup,
      { groupId },
      { page, limit },
      {
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      },
    );
  }

  async updateGroupInformation(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ) {
    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        ...updateGroupDto,
      },
    });
  }

  async addMember(groupId: string, addStduentGroupDto: AddStudentGroupDto) {
    const { students: studentEmails } = addStduentGroupDto;
    const classroom = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { classroomId: true },
    });
    const classroomId = classroom.classroomId;
    if (studentEmails.length === 0) {
      throw new Error('No students to add');
    }
    const dto = await Promise.all(
      studentEmails.map(async (email) => {
        return {
          studentId: await this.emailToStudentId(email.email),
          groupId: groupId,
          classroomId: classroomId,
        };
      }),
    );
    return this.prisma.studentGroup.createMany({
      data: dto,
      skipDuplicates: true,
    });
  }

  async emailToStudentId(email: string) {
    const userId = await this.prisma.user.findUnique({
      where: { email: email },
      select: { id: true },
    });
    if (!userId) {
      throw new Error('User not found');
    }
    const student = await this.prisma.student.findUnique({
      where: { userId: userId.id },
      select: { id: true },
    });
    if (!student) {
      throw new Error('Student not found');
    }
    return student.id;
  }

  async deleteGroup(groupId: string) {
    await this.prisma.studentGroup.updateMany({
      where: { groupId: groupId },
      data: { deletedAt: new Date() },
    });
    return this.prisma.group.update({
      where: { id: groupId },
      data: { deletedAt: new Date() },
    });
  }
}
