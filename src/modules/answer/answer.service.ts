import { Injectable } from '@nestjs/common';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from '@/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswerSource, AnswerSourceType } from '@/common/utils/answer-source';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async updateAnswerInformation(
    answerId: string,
    updateAnswerDto: UpdateAnswerDto,
  ) {
    return this.prisma.answer.update({
      data: {
        ...updateAnswerDto,
      },
      where: { id: answerId },
    });
  }

  async deleteAnswer(answerId: string) {
    return this.prisma.answer.update({
      where: { id: answerId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async createAnswer(studentId: string, createAnswerDto: CreateAnswerDto) {
    let score = 0;
    let isCorrect = false;
    const question = await this.prisma.question.findUnique({
      where: { id: createAnswerDto.questionId },
    });
    if (!question) {
      throw new Error('Question not found');
    }
    if (question.type === 'MCQ') {
      const correctAnswer = await this.prisma.questionOption.findFirst({
        where: {
          questionId: question.id,
          isCorrect: true,
        },
      });
      if (correctAnswer.id === createAnswerDto.selectedOptionId) {
        score = question.score;
        isCorrect = true;
      }
    } else {
      const questionEssay = await this.prisma.questionEssay.findMany({
        where: { questionId: question.id },
      });
      questionEssay.forEach(async (questionEssay) => {
        if (
          questionEssay.correctAnswer.toLowerCase() ===
          createAnswerDto.text.toLowerCase()
        ) {
          score = question.score;
          isCorrect = true;
        }
      });
      // call api to check the answer
    }
    switch (createAnswerDto.answerSource.type) {
      case AnswerSourceType.QUIZ:
        await this.prisma.quizAttempt.update({
          where: { id: createAnswerDto.contextId },
          data: {
            score: {
              increment: score,
            },
          },
        });
        break;
      case AnswerSourceType.SLIDE: {
        const slide = await this.prisma.slidePage.findUnique({
          where: { id: createAnswerDto.answerSource.contextId },
        });
        const file = await this.prisma.file.findUnique({
          where: { id: slide.fileId },
        });
        const material = await this.prisma.material.findUnique({
          where: { id: file.materialId },
        });
        const classroom = await this.prisma.classroom.findUnique({
          where: { id: material.classroomId },
        });
        await this.prisma.studentClassroom.update({
          where: { id: classroom.id, studentId: studentId },
          data: {
            score: {
              increment: score,
            },
          },
        });
        break;
      }
      case AnswerSourceType.SUBMISSION: {
        const submission = await this.prisma.submission.findUnique({
          where: { id: createAnswerDto.answerSource.contextId },
        });
        const assignment = await this.prisma.assignment.findUnique({
          where: { id: submission.assignmentId },
        });
        const material = await this.prisma.material.findUnique({
          where: { id: assignment.materialId },
        });
        const classroom = await this.prisma.classroom.findUnique({
          where: { id: material.classroomId },
        });
        await this.prisma.studentClassroom.update({
          where: { id: classroom.id, studentId: studentId },
          data: {
            score: {
              increment: score,
            },
          },
        });
        break;
      }
    }
    return await this.prisma.answer.create({
      data: {
        ...createAnswerDto,
        createdBy: studentId,
        score: score,
        isCorrect: isCorrect,
      },
    });
  }
}
