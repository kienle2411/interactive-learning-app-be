import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { PrismaService } from '@/prisma.service';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PaginationHelper } from '@/common/helpers';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuiz(teacherId: string, createQuizDto: CreateQuizDto) {
    return await this.prisma.quiz.create({
      data: {
        ...createQuizDto,
        teacherId: teacherId,
      },
    });
  }

  async updateQuizInformation(quizId: string, updateQuizDto: UpdateQuizDto) {
    return await this.prisma.quiz.update({
      where: { id: quizId },
      data: {
        ...updateQuizDto,
      },
    });
  }

  async getQuizInformation(quizId: string) {
    return await this.prisma.quiz.findUnique({
      where: { id: quizId },
    });
  }

  async attemptQuiz(quizId: string, studentId: string) {
    return await this.prisma.quizAttempt.create({
      data: {
        quizId: quizId,
        studentId: studentId,
        startTime: new Date(),
      },
    });
  }

  async leaveQuiz(quizId: string, studentId: string) {
    const quizAttempt = await this.prisma.quizAttempt.findFirst({
      where: {
        quizId: quizId,
        studentId: studentId,
        endTime: null,
      },
    });
    if (!quizAttempt) {
      throw new Error('Quiz attempt not found');
    }
    return await this.prisma.quizAttempt.update({
      where: { id: quizAttempt.id },
      data: {
        endTime: new Date(),
      },
    });
  }

  async submitQuiz(quizAttemptId: string) {
    return await this.prisma.quizAttempt.update({
      where: { id: quizAttemptId },
      data: {
        endTime: new Date(),
      },
    });
  }

  async getQuizQuestions(quizId: string) {
    return await this.prisma.questionLink.findMany({
      where: {
        linkedId: quizId,
        linkedType: 'QUIZ',
      },
      include: {
        question: true,
      },
    });
  }

  async getLeaderboard(quizId: string) {
    const attempts = await this.prisma.quizAttempt.groupBy({
      by: ['studentId'],
      where: {
        quizId: quizId,
      },
      _count: {
        _all: true,
      },
    });
    const students = await this.prisma.student.findMany({
      where: {
        id: {
          in: attempts.map((attempt) => attempt.studentId),
        },
      },
      select: {
        id: true,
      },
    });
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: students.map((student) => student.id),
        },
      },
      select: {
        id: true,
        username: true,
      },
    });
    return attempts
      .map((attempt) => {
        const student = students.find(
          (student) => student.id === attempt.studentId,
        );
        const user = users.find((user) => user.id === student.id);
        return {
          studentId: attempt.studentId,
          username: user.username,
          score: attempt._count._all,
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  async getAllQuizzes(teacherId: string, page: number = 1, limit: number = 0) {
    return PaginationHelper.paginate(
      this.prisma.quiz,
      { teacherId: teacherId },
      { page, limit },
    );
  }

  async deleteQuiz(quizId: string) {
    await this.prisma.questionLink.updateMany({
      where: {
        linkedId: quizId,
        linkedType: 'QUIZ',
      },
      data: {
        deletedAt: new Date(),
      },
    });
    await this.prisma.quizAttempt.updateMany({
      where: {
        quizId: quizId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return this.prisma.quiz.update({
      where: { id: quizId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
