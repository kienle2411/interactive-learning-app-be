import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { UserService } from '../user/user.service';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment-submission.dto';
import { SubmissionStatus } from '@prisma/client';
import { FileService } from '../file/file.service';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  // async getAllAssignment(userId: string) {
  //   let studentId: string | null = null;
  //   let teacherId: string | null = null;

  //   try {
  //     studentId = await this.usersService.getStudentIdByUserId(userId);
  //   } catch (error) {
  //     if (!(error instanceof NotFoundException)) {
  //       throw error;
  //     }
  //   }

  //   if (!studentId) {
  //     teacherId = await this.usersService.getTeacherIdByUserId(userId);
  //     if (!teacherId) {
  //       throw new Error('User is neither a student nor a teacher');
  //     }
  //   }

  //   if (studentId) {
  //     const classrooms = await this.prisma.studentClassroom.findMany({
  //       where: { studentId },
  //       select: { classroomId: true },
  //     });
  //     const classroomIds = classrooms.map((classroom) => classroom.classroomId);
  //     const assignments = await this.prisma.assignment.findMany({
  //       where: { classroomId: { in: classroomIds } },
  //     });
  //     return assignments;
  //   }

  //   if (teacherId) {
  //     const classrooms = await this.prisma.classroom.findMany({
  //       where: { teacherId },
  //       select: { id: true },
  //     });
  //     const classroomIds = classrooms.map((classroom) => classroom.id);
  //     const assignments = await this.prisma.assignment.findMany({
  //       where: { classroomId: { in: classroomIds } },
  //     });
  //     return assignments;
  //   }

  //   throw new Error('User is neither a student nor a teacher');
  // }

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

  async getAssignmentQuestions(assignmentId: string) {
    return this.prisma.questionLink.findMany({
      where: {
        linkedId: assignmentId,
        linkedType: 'ASSIGNMENT',
      },
      select: {
        question: true,
      },
    });
  }

  async deleteAssignment(assignmentId: string) {
    return this.prisma.assignment.update({
      where: { id: assignmentId },
      data: { deletedAt: new Date() },
    });
  }

  async createAssignmentSubmission(
    userId: string,
    assignmentId: string,
    createAssignmentSubmissionDto: CreateAssignmentSubmissionDto,
    file?: Express.Multer.File,
  ) {
    await this.prisma.answer.createMany({
      data: createAssignmentSubmissionDto.answers.map((answer) => ({
        ...answer,
      })),
    });
    const fileUploaded = await this.fileService.createFile(file, userId);
    await this.prisma.submissionFile.create({
      data: {
        fileId: fileUploaded.id,
        submissionId: assignmentId,
      },
    });
    return this.prisma.submission.create({
      data: {
        assignmentId: assignmentId,
        studentId: await this.userService.getStudentIdByUserId(userId),
        status: SubmissionStatus.SUBMITTED,
      },
    });
  }
}
