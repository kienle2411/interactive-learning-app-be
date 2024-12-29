import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStudentInClassroomDto } from './dto/create-student-in-classroom.dto';
import { UsersService } from 'src/modules/users/users.service';
import { AddStudentByEmailDto } from './dto/add-student-by-email.dto';
import { CreateClassroomDto } from 'src/modules/classrooms/dto/create-classroom.dto';

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

  async joinClassroomByCode(userId: string, code: string) {
    const studentId = await this.usersService.getStudentIdByUserId(userId);
    const classroom = await this.prisma.classroom.findUnique({
      where: {
        classroomCode: code,
      },
      select: {
        id: true,
      },
    });
    if (!classroom) {
      throw new Error('Classroom not found');
    }
    return this.prisma.studentInClassroom.create({
      data: {
        classroomId: classroom.id,
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
