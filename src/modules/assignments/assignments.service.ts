import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getAllAssignment(userId: string) {
    let studentId: string | null = null;
    let teacherId: string | null = null;

    try {
      studentId = await this.usersService.getStudentIdByUserId(userId);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    if (!studentId) {
      teacherId = await this.usersService.getTeacherIdByUserId(userId);
      if (!teacherId) {
        throw new Error('User is neither a student nor a teacher');
      }
    }

    if (studentId) {
      const classrooms = await this.prisma.studentInClassroom.findMany({
        where: { studentId },
        select: { classroomId: true },
      });
      const classroomIds = classrooms.map((classroom) => classroom.classroomId);
      const assignments = await this.prisma.assignment.findMany({
        where: { classroomId: { in: classroomIds } },
      });
      return assignments;
    }

    if (teacherId) {
      const classrooms = await this.prisma.classroom.findMany({
        where: { teacherId },
        select: { id: true },
      });
      const classroomIds = classrooms.map((classroom) => classroom.id);
      const assignments = await this.prisma.assignment.findMany({
        where: { classroomId: { in: classroomIds } },
      });
      return assignments;
    }

    throw new Error('User is neither a student nor a teacher');
  }

  async getAssignmentInformation(assignmentId: string) {
    return this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
  }

  async updateAssignment(
    assignmentId: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        ...updateAssignmentDto,
      },
    });
  }

  async joinAssignment(userId: string, assignmentId: string) {
    const studentId = await this.usersService.getStudentIdByUserId(userId);
    return this.prisma.studentInAssignment.create({
      data: {
        studentId,
        assignmentId,
      },
    });
  }

  async getAssignmentQuestions(assignmentId: string) {
    return this.prisma.question.findMany({
      where: {
        assignmentId: assignmentId,
      },
    });
  }

  async deleteAssignment(assignmentId: string) {
    await this.prisma.studentInAssignment.updateMany({
      where: { assignmentId: assignmentId },
      data: { deletedAt: new Date() },
    });
    return this.prisma.assignment.update({
      where: { id: assignmentId },
      data: { deletedAt: new Date() },
    });
  }
}
