import { PaginationHelper } from '@/common/helpers';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateStudentInGroupDto } from '../student-in-group/dto/create-student-in-group.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroupInformation(groupId: string) {
    return await this.prisma.group.findUnique({
      where: { id: groupId },
    });
  }

  async getGroupMembers(groupId: string, page: number = 1, limit: number = 0) {
    return PaginationHelper.paginate(
      this.prisma.studentInGroup,
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

  async editGroupInformation(groupId: string, updateGroupDto: UpdateGroupDto) {
    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        ...updateGroupDto,
      },
    });
  }

  async addMember(groupId, createStudentInGroupDto: CreateStudentInGroupDto) {
    const { studentIds } = createStudentInGroupDto;
    const classroom = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { classroomId: true },
    });
    const classroomId = classroom.classroomId;
    studentIds.forEach((studentId) => {});
    const dto = studentIds.map((studentId) => ({
      studentId,
      groupId,
      classroomId,
    }));
    return this.prisma.studentInGroup.createMany({
      data: [...dto],
      skipDuplicates: true,
    });
  }
}
