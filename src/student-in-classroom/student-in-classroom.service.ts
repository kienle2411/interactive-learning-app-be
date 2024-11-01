import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStudentInClassroomDto } from './dto/create-student-in-classroom.dto';
import { UsersService } from 'src/users/users.service';
import { AddStudentByEmailDto } from './dto/add-student-by-email.dto';
import { CreateClassroomDto } from 'src/classrooms/dto/create-classroom.dto';

@Injectable()
export class StudentInClassroomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async joinClassroom(userId: string, classroomId: string) {
    const studentId = await this.usersService.getStudentIdByUserId(userId);
    return this.prisma.studentInClassroom.create({
      data: {
        classroomId,
        studentId,
      },
    });
  }

  async addStudentToClassroomByEmail(classroomId: string, emails: string[]) {
    const userIds = this.prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      select: {
        id: true,
      },
    });

    const userIdList = (await userIds).map((user) => user.id);
    console.log(userIdList);

    const studentIds = this.prisma.student.findMany({
      where: {
        userId: {
          in: userIdList,
        },
      },
      select: {
        id: true,
      },
    });

    const studentIdList = (await studentIds).map((student) => student.id);
    const createStudentInClassroomData: CreateStudentInClassroomDto[] =
      studentIdList.map((studentId) => ({
        studentId,
        classroomId,
      }));
    return this.prisma.studentInClassroom.createMany({
      data: createStudentInClassroomData,
    });
  }

  async deleteStudentFromClassroomByStudentId(
    studentId: string,
    classroomId: string,
  ) {
    return this.prisma.studentInClassroom.delete({
      where: {
        studentId_classroomId: {
          studentId,
          classroomId,
        },
      },
    });
  }
}
