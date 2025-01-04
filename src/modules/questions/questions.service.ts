import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CreateChoiceDto } from '../choice/dto/create-choice.dto';
import { CreateAnswerDto } from '../answers/dto/create-answer.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: createQuestionDto,
    });
  }

  async updateQuestionInformation(
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.prisma.question.update({
      data: {
        ...updateQuestionDto,
      },
      where: { id: questionId },
    });
  }

  async getQuestionInformation(questionId: string) {
    return this.prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        questionType: true,
        responseType: true,
        questionTitle: true,
        content: true,
        timeResponse: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        score: true,
        orderInSlide: true,
        medias: true,
        options: true,
        assignmentId: true,
        docFileId: true,
      },
    });
  }

  async createQuestionChoice(
    questionId: string,
    createChoiceDto: CreateChoiceDto,
  ) {
    return this.prisma.option.create({
      data: {
        ...createChoiceDto,
        questionId: questionId,
      },
    });
  }

  async createQuestionAnswer(
    questionId: string,
    createAnswerDto: CreateAnswerDto,
  ) {
    return this.prisma.answer.create({
      data: {
        ...createAnswerDto,
        questionId: questionId,
      },
    });
  }
}
