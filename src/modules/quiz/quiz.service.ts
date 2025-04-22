import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { PrismaService } from '@/prisma.service';
import { UpdateQuizDto } from './dto/update-quiz.dto';

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
}
